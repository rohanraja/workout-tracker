const { Client } = require("@notionhq/client");
const http = require("http");
const url = require('url');


const PORT = 5007;
const databaseId = "633c7560e61b4c7baf846454d9c2391b";

const workoutIdMap = {};

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

  else if (req.url.indexOf("/create") !== -1 && req.method === "GET") {
    //response headers

    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);

    console.log("Create Request recieved!");
    //set the response
    const workout = queryObject['w'] ;
    const weight = queryObject['weight'] ;
    const reps = queryObject['reps'] ;

    await createPage(workoutIdMap[workout], weight, reps);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.write("Created!");
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

const createPage = async (wid, weight, rep) => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const response = await notion.pages.create({
    parent: {
      database_id: "a7530807529441e6bcc7e4649f399236",
    },
    icon: {
      type: "emoji",
      emoji: "🎉",
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: "test from api",
            },
          },
        ],
      },
      Workout: {
        relation: [
          {
            id: wid,
          },
        ],
      },
      "Weight(kg)": {
        number: parseInt(weight),
      },
      "Reps": {
        number: parseInt(rep),
      },
    },
  });
  console.log(response);
};

server.listen(PORT, () => {
  console.log(`server started on port: ${PORT}`);
});

async function getList() {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });

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
    const id = res.id;
    const name = res.properties["Name"].title[0].plain_text;

    workoutIdMap[name] = id; 

    return name;
  });

  return exercises;
}
