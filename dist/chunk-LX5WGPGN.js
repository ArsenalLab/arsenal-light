import { spawn } from 'child_process';
import { createInterface } from 'readline';

// src/sandboxes/no-sandbox/no-sandbox.ts

// src/utils/boundedTail.ts
var MAX_TAIL_CHARS = 64 * 1024;
var BoundedTail = class {
  items = [];
  totalChars = 0;
  maxChars;
  separator;
  /**
   * @param maxChars Maximum length of the joined tail. Defaults to {@link MAX_TAIL_CHARS}.
   * @param separator String placed between items by {@link toString}. Must match
   *   how the caller would otherwise have joined the accumulated chunks (e.g.
   *   `"\n"` for line streams, `""` for raw chunk streams).
   */
  constructor(maxChars = MAX_TAIL_CHARS, separator = "") {
    this.maxChars = maxChars;
    this.separator = separator;
  }
  /** Append one item to the tail, evicting oldest items to stay within budget. */
  push(item) {
    const bounded = item.length > this.maxChars ? item.slice(item.length - this.maxChars) : item;
    this.totalChars += bounded.length + (this.items.length > 0 ? this.separator.length : 0);
    this.items.push(bounded);
    while (this.totalChars > this.maxChars && this.items.length > 1) {
      const dropped = this.items.shift();
      this.totalChars -= dropped.length + this.separator.length;
    }
  }
  /** Join the retained tail into a single string (length ≤ `maxChars`). */
  toString() {
    return this.items.join(this.separator);
  }
};

// src/sandboxes/no-sandbox/no-sandbox.ts
var noSandbox = (options) => ({
  tag: "none",
  name: "no-sandbox",
  env: options?.env ?? {},
  create: async (createOptions) => {
    const worktreePath = createOptions.worktreePath;
    const processEnv = { ...process.env, ...createOptions.env };
    const maxOutputTailChars = options?.maxOutputTailChars ?? MAX_TAIL_CHARS;
    const handle = {
      worktreePath,
      exec: (command, opts) => {
        const cwd = opts?.cwd ?? worktreePath;
        const isWindows = process.platform === "win32";
        const shellCmd = isWindows ? "cmd.exe" : "sh";
        const shellArgs = isWindows ? ["/d", "/s", "/c", command] : ["-c", command];
        return new Promise((resolve, reject) => {
          const proc = spawn(shellCmd, shellArgs, {
            cwd,
            env: processEnv,
            stdio: [
              opts?.stdin !== void 0 ? "pipe" : "ignore",
              "pipe",
              "pipe"
            ],
            windowsVerbatimArguments: isWindows
          });
          if (opts?.stdin !== void 0) {
            proc.stdin.write(opts.stdin);
            proc.stdin.end();
          }
          proc.on("error", (error) => {
            reject(new Error(`exec failed: ${error.message}`));
          });
          if (opts?.onLine) {
            const onLine = opts.onLine;
            const stdoutTail = new BoundedTail(maxOutputTailChars, "\n");
            const stderrTail = new BoundedTail(maxOutputTailChars, "");
            const rl = createInterface({ input: proc.stdout });
            rl.on("line", (line) => {
              stdoutTail.push(line);
              onLine(line);
            });
            proc.stderr.on("data", (chunk) => {
              stderrTail.push(chunk.toString());
            });
            proc.on("close", (code) => {
              resolve({
                stdout: stdoutTail.toString(),
                stderr: stderrTail.toString(),
                exitCode: code ?? 0
              });
            });
          } else {
            const stdoutChunks = [];
            const stderrChunks = [];
            proc.stdout.on("data", (chunk) => {
              stdoutChunks.push(chunk.toString());
            });
            proc.stderr.on("data", (chunk) => {
              stderrChunks.push(chunk.toString());
            });
            proc.on("close", (code) => {
              resolve({
                stdout: stdoutChunks.join(""),
                stderr: stderrChunks.join(""),
                exitCode: code ?? 0
              });
            });
          }
        });
      },
      interactiveExec: (args, opts) => {
        return new Promise((resolve, reject) => {
          const [cmd, ...rest] = args;
          const proc = spawn(cmd, rest, {
            cwd: opts.cwd ?? worktreePath,
            env: processEnv,
            stdio: ["pipe", "pipe", "inherit"],
            shell: process.platform === "win32"
          });
          opts.stdin.pipe(proc.stdin);
          proc.stdout.pipe(opts.stdout);
          proc.on("error", (error) => {
            reject(new Error(`exec failed: ${error.message}`));
          });
          proc.on("close", (code) => {
            resolve({ exitCode: code ?? 0 });
          });
        });
      },
      close: async () => {
      }
    };
    return handle;
  }
});

export { noSandbox };
//# sourceMappingURL=chunk-LX5WGPGN.js.map
//# sourceMappingURL=chunk-LX5WGPGN.js.map