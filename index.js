const { Client } = require('@notionhq/client');

const notion = new Client({ auth: process.env.NOTION_API_KEY });


(async () => {
    const databaseId = '633c7560e61b4c7baf846454d9c2391b';
    const response = await notion.databases.retrieve({ database_id: databaseId });
    console.log(response);
  })();