const fetch = require("node-fetch");
const fs = require("fs");

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.DATABASE_ID;

async function getTasks() {
  const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();
  return data.results;
}

function generateMermaid(tasks) {
  let code = "graph TD\n";

  tasks.forEach((task, i) => {
    const name = task.properties.Name.title[0]?.plain_text || `Task${i}`;
    code += `T${i}[${name}]\n`;

    if (i > 0) {
      code += `T${i-1} --> T${i}\n`;
    }
  });

  return code;
}

(async () => {
  const tasks = await getTasks();
  const mermaid = generateMermaid(tasks);

  fs.writeFileSync("diagram.mmd", mermaid);
})();
