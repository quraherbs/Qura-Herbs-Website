import json
import subprocess
import time
import urllib.request
import asyncio
import websockets
import sys

VIEWPORTS = [
    ("320px", 320, 568),
    ("360px", 360, 640),
    ("375px", 375, 812),
    ("390px", 390, 844),
    ("414px", 414, 896),
    ("430px", 430, 932),
    ("768px", 768, 1024),
    ("1024px", 1024, 768),
    ("1280px", 1280, 800),
    ("1440px", 1440, 900),
]

async def check_viewport(url, name, width, height):
    # Launch Chrome
    proc = subprocess.Popen([
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        "--headless=new",
        f"--remote-debugging-port=9222",
        f"--window-size={width},{height}",
        "--disable-gpu",
        "--no-sandbox"
    ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    await asyncio.sleep(1.2)

    try:
        tabs = json.loads(urllib.request.urlopen("http://localhost:9222/json").read())
        ws_url = tabs[0]["webSocketDebuggerUrl"]

        async with websockets.connect(ws_url) as ws:
            # Override device metrics
            await ws.send(json.dumps({
                "id": 1,
                "method": "Emulation.setDeviceMetricsOverride",
                "params": {
                    "width": width,
                    "height": height,
                    "deviceScaleFactor": 1,
                    "mobile": width < 768
                }
            }))

            # Navigate
            await ws.send(json.dumps({"id": 2, "method": "Page.navigate", "params": {"url": url}}))
            await asyncio.sleep(2.5)

            # Evaluate
            js = """
            (() => {
                const docWidth = window.innerWidth;
                const scrollWidth = document.documentElement.scrollWidth;
                const bodyScrollWidth = document.body.scrollWidth;
                const maxScrollWidth = Math.max(scrollWidth, bodyScrollWidth);
                const overflowing = [];
                for (const el of document.querySelectorAll('*')) {
                    const rect = el.getBoundingClientRect();
                    if (rect.right > docWidth + 2) {
                        overflowing.push({
                            tag: el.tagName,
                            id: el.id,
                            className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 80) : '',
                            right: Math.round(rect.right),
                            width: Math.round(rect.width),
                            docWidth: docWidth
                        });
                    }
                }
                return {
                    docWidth,
                    scrollWidth: maxScrollWidth,
                    hasOverflow: maxScrollWidth > docWidth + 2,
                    overflowCount: overflowing.length,
                    topOverflows: overflowing.slice(0, 5)
                };
            })()
            """
            await ws.send(json.dumps({"id": 3, "method": "Runtime.evaluate", "params": {"expression": js, "returnByValue": True}}))
            
            while True:
                msg = json.loads(await ws.recv())
                if msg.get("id") == 3:
                    result = msg["result"]["result"]["value"]
                    return result
    finally:
        proc.kill()
        await asyncio.sleep(0.5)

async def main():
    target_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
    print(f"=== Auditing {target_url} across viewports ===")
    all_pass = True
    for name, w, h in VIEWPORTS:
        try:
            res = await check_viewport(target_url, name, w, h)
            status = "PASS" if not res["hasOverflow"] else "FAIL"
            if res["hasOverflow"]:
                all_pass = False
            print(f"[{name}] (w={w}): {status} | clientWidth={res['docWidth']} scrollWidth={res['scrollWidth']}")
            if res["hasOverflow"]:
                for o in res["topOverflows"]:
                    print(f"   -> Overflow: <{o['tag']}> id={o['id']} right={o['right']}px width={o['width']}px class={o['className']}")
        except Exception as e:
            print(f"[{name}]: ERROR {e}")
    print(f"Overall Result: {'ALL PASS' if all_pass else 'SOME FAILED'}")

if __name__ == "__main__":
    asyncio.run(main())
