const ws = new WebSocket("ws:/localhost:9527");

ws.addEventListener("open", ({ target: s }) => {
  s.addEventListener("message", ({ data }) => {
    const result = JSON.parse(data);

    switch (result.type) {
      case "message":
        console.log(result.content);
        break;
      case "change":
        const { file } = result;
        if (file.endsWith(".css")) {
          fetch(file)
            .then((data) => data.text())
            .then((content) => {
              const el = document.querySelector("style#hot");
              if (el) {
                el.textContent = content;
              } else {
                const el = document.createElement("style");
                el.id = "hot";
                el.textContent = content;
                document.querySelector("head").appendChild(el);
              }
              console.log(content);
            })
            .catch((err) => console.log("err", err));
        } else {
          window.location.reload();
        }
        break;
    }
    console.log(result);
  });

  s.addEventListener("close", () => {
    console.log("close");
  });
});
