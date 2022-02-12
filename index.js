const { Client } = require("@notionhq/client");
const http = require("http");

const PORT = 5007;

const server = http.createServer(async (req, res) => {
  //set the request route
  if (req.url === "/api" && req.method === "GET") {
    //response headers

    console.log("Request recieved!");
    res.writeHead(200, { "Content-Type": "application/json" });
    //set the response

    const list = await getList();
    console.log(list);
    res.write(JSON.stringify(list));
    // res.write('["first", "second", "Barbell squats", "Lying dumbell"]');
    // res.write('{"list": ["first", "second", "Barbell squats", "Lying dumbell"] }');
    //end the response
    res.end();
  }

  // If no route present
  else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

async function getList() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

  const databaseId = "633c7560e61b4c7baf846454d9c2391b";
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: [
        {
          property: "Pick today",
          checkbox: {
            equals: true,
          },
        },
      ],
    },
    // sorts: [
    //   {
    //     property: 'Last ordered',
    //     direction: 'ascending',
    //   },
    // ],
  });

  const exercises = response.results.map((res) => {
    return res.properties["Name"].title[0].plain_text;
  });
  console.log(exercises);

  return exercises;
}
