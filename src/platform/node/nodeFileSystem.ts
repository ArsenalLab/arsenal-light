/**
 * A `node:fs`-backed implementation of `@effect/platform`'s `FileSystem`
 * service, covering only the methods Arsenal actually calls (`stat`,
 * `readFileString`, `readDirectory`, `realPath`, `remove`, `makeDirectory`,
 * `writeFileString`).
 *
 * `@effect/platform-node`'s `NodeFileSystem`/`NodeContext` provide the same
 * service but bundle `undici` (HTTP client, fetch, WebSocket) for platform
 * features Arsenal never uses, roughly doubling the published bundle size.
 * Every other `FileSystem` method falls back to `FileSystem.layerNoop`'s
 * defaults (fail with a clear "not implemented"/`NotFound` error), so a
 * caller that reaches for an unimplemented method finds out immediately
 * instead of silently misbehaving.
 */

import type { Stats } from "node:fs";
import { mkdir, readdir, readFile, realpath, rm, stat, writeFile } from "node:fs/promises";
import { FileSystem } from "@effect/platform";
import { SystemError, type PlatformError, type SystemErrorReason } from "@effect/platform/Error";
import { Effect, Option, type Layer } from "effect";

const REASON_BY_CODE: Record<string, SystemErrorReason> = {
  ENOENT: "NotFound",
  EEXIST: "AlreadyExists",
  EACCES: "PermissionDenied",
  EPERM: "PermissionDenied",
  EBUSY: "Busy",
  ETIMEDOUT: "TimedOut",
  EISDIR: "InvalidData",
  ENOTDIR: "InvalidData",
};

const toSystemError = (
  method: string,
  pathOrDescriptor: string,
  cause: unknown,
): PlatformError => {
  const errno = cause as NodeJS.ErrnoException;
  return new SystemError({
    module: "FileSystem",
    method,
    reason: REASON_BY_CODE[errno?.code ?? ""] ?? "Unknown",
    pathOrDescriptor,
    syscall: errno?.syscall,
    cause,
  });
};

const run = <A>(
  method: string,
  path: string,
  thunk: () => Promise<A>,
): Effect.Effect<A, PlatformError> =>
  Effect.tryPromise({
    try: thunk,
    catch: (cause) => toSystemError(method, path, cause),
  });

const fileType = (s: Stats): FileSystem.File.Type => {
  if (s.isDirectory()) return "Directory";
  if (s.isSymbolicLink()) return "SymbolicLink";
  if (s.isBlockDevice()) return "BlockDevice";
  if (s.isCharacterDevice()) return "CharacterDevice";
  if (s.isFIFO()) return "FIFO";
  if (s.isSocket()) return "Socket";
  if (s.isFile()) return "File";
  return "Unknown";
};

const toFileInfo = (s: Stats): FileSystem.File.Info => ({
  type: fileType(s),
  mtime: Option.fromNullable(s.mtime),
  atime: Option.fromNullable(s.atime),
  birthtime: Option.fromNullable(s.birthtime),
  dev: s.dev,
  ino: Option.some(s.ino),
  mode: s.mode,
  nlink: Option.some(s.nlink),
  uid: Option.some(s.uid),
  gid: Option.some(s.gid),
  rdev: Option.some(s.rdev),
  size: FileSystem.Size(s.size),
  blksize: Option.some(FileSystem.Size(s.blksize)),
  blocks: Option.some(s.blocks),
});

/**
 * Lightweight substitute for `@effect/platform-node`'s `NodeFileSystem.layer`.
 * Provide this to satisfy the `FileSystem.FileSystem` requirement without
 * depending on `@effect/platform-node` or `@effect/platform`'s `NodeContext`.
 */
export const layer: Layer.Layer<FileSystem.FileSystem> = FileSystem.layerNoop({
  stat: (path) => run("stat", path, () => stat(path)).pipe(Effect.map(toFileInfo)),

  readFileString: (path, encoding) =>
    run("readFileString", path, () =>
      readFile(path, (encoding ?? "utf8") as BufferEncoding),
    ),

  readDirectory: (path, options) =>
    run("readDirectory", path, () => readdir(path, { recursive: options?.recursive })),

  realPath: (path) => run("realPath", path, () => realpath(path)),

  remove: (path, options) =>
    run("remove", path, () =>
      rm(path, { recursive: options?.recursive, force: options?.force }).then(
        () => undefined,
      ),
    ),

  makeDirectory: (path, options) =>
    run("makeDirectory", path, () =>
      mkdir(path, { recursive: options?.recursive, mode: options?.mode }).then(
        () => undefined,
      ),
    ),

  writeFileString: (path, data, options) =>
    run("writeFileString", path, () =>
      writeFile(path, data, {
        flag: options?.flag ?? "w",
        mode: options?.mode,
      }),
    ),
});
