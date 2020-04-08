const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validateRepositoryId(request, response, next){
  const { id } = request.params;
  
  if(!isUuid(id)){
    return response.status(400).json({ error: "Ivalid repository ID" })
  }

  return next();
}

app.use("/repositories/:id", validateRepositoryId);
app.use("/repositories/:id/like", validateRepositoryId);

app.get("/repositories", (request, response) => {
  // result todo repository.
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  // Add new repository.
  const { title, url, techs, likes } = request.body;
  const id = uuid();

  const repository = {
    id,
    title,
    url,
    techs: techs.split(", ").map(tech => tech.trim()),
    likes
  };

  repositories.push(repository);
  return response.status(200).json(repository);

});

app.put("/repositories/:id", (request, response) => {
  // update repository
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex((rep) => rep.id === id);
  if(index < 0){
    return response.status(400).json({ error: "Repository not Found!" });
  }

  const repository = {
    id,
    title,
    url,
    techs: techs.split(", ").map(tech => tech.trim()),
    likes: repositories[index].likes
  };

  repositories[index] = repository;
  return response.status(200).json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  // Delete repository
  const { id } = request.params;
  const index = repositories.findIndex((rep) => rep.id === id)

  if(index < 0){
    return response.status(400).json({ error: "Repository not found ID." });
  }

  repositories.splice(index, 1);
  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  // add new like
  const { id } = request.params;
  const index = repositories.findIndex((rep) => rep.id === id);

  if(index < 0){
    return response.status(400).json({ error: "Repository not found ID." });
  }

  repositories[index].likes++;
  return response.status(200).json(repositories[index]);

});

module.exports = app;
