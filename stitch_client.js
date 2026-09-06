/**
 * Stitch MCP Client Helper
 * Allows programmatic interaction with Stitch MCP server for screen generation and design retrieval.
 */

const { spawn } = require('child_process');

const STITCH_API_KEY = process.env.STITCH_API_KEY || "";

function callStitch(toolName, args = {}) {
    return new Promise((resolve, reject) => {
        const nodePath = "C:\\Users\\yashw\\AppData\\Local\\Programs\\nodejs";
        const env = {
            ...process.env,
            PATH: `${nodePath};${process.env.PATH || ''}`,
            STITCH_API_KEY: STITCH_API_KEY
        };

        const proc = spawn('cmd.exe', ['/c', 'npx', '-y', 'stitch-mcp-server@latest'], {
            env: env
        });

        let output = '';
        let errOutput = '';

        let resolved = false;
        function checkDone() {
            if (resolved) return;
            const lines = output.trim().split('\n');
            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line.trim());
                    if (parsed.id === 2) {
                        resolved = true;
                        proc.kill();
                        if (parsed.result) resolve(parsed.result);
                        else resolve(parsed);
                        return;
                    }
                } catch (e) {}
            }
        }

        proc.stdout.on('data', (data) => {
            output += data.toString();
            checkDone();
        });

        proc.stderr.on('data', (data) => {
            errOutput += data.toString();
        });

        const initReq = JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "initialize",
            params: {
                protocolVersion: "2024-11-05",
                capabilities: {},
                clientInfo: { name: "antigravity-client", version: "1.0.0" }
            }
        }) + "\n";

        const isListTools = toolName === "list_tools" || toolName === "tools";
        const callReq = JSON.stringify(isListTools ? {
            jsonrpc: "2.0",
            id: 2,
            method: "tools/list",
            params: {}
        } : {
            jsonrpc: "2.0",
            id: 2,
            method: "tools/call",
            params: {
                name: toolName,
                arguments: args
            }
        }) + "\n";

        proc.stdin.write(initReq);
        proc.stdin.write(callReq);

        const timeout = setTimeout(() => {
            if (!resolved) {
                proc.stdin.end();
            }
        }, 45000);

        proc.on('close', () => {
            clearTimeout(timeout);
            if (!resolved) {
                checkDone();
                if (!resolved) {
                    resolve({ raw: output, err: errOutput });
                }
            }
        });

        proc.on('error', (err) => {
            reject(err);
        });
    });
}

const action = process.argv[2] || 'list_projects';
const argParam = process.argv[3] ? JSON.parse(process.argv[3]) : {};

callStitch(action, argParam)
    .then((res) => {
        console.log(JSON.stringify(res, null, 2));
    })
    .catch((err) => {
        console.error("Error:", err);
    });
