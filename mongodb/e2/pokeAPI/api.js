const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Pokemon = require("./models/pokemon");


const api

/*const arrayFlatten = require("array-flatten");
const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser"); //configura nuestra api para que decodifique los posibles body q vengan
const { request, response } = require("express");
const { stringify } = require("querystring");
const dbPokemon = "db/dbPokemon.json";

const api = express();
// CONFIGURACION: CORS para que el API sea publica
api.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
    api.options("*", (req, res) => {
        // allowed XHR methods
        res.header(
            "Access-Control-Allow-Methods",
            "GET, PATCH, PUT, POST, DELETE, OPTIONS"
        );
        res.send();
    });
});
api.use(bodyParser.json()); //necesario para parseo de string json
api.use(bodyParser.urlencoded({ extended: true })); //decodifica la información del body
// GET
api.get("/api/pokemons", (request, response) => {
    fs.readFile(dbPokemon, (err, data) => {
        if (err) throw err; // Elevar o notificar una excepcion, no hace falta hacer un else
        const allPokemons = JSON.parse(data); //transforma data en json, parseamos el contenido del fichero a formato JSON
        response.status(200).send({
            success: true,
            metho: "GET",
            url: "/api/pokemons",
            pokemons: allPokemons, //no viene en formato json
        });
    });
});

//POST , meter un nuevo pokemonpor parametros (cuando alguien envie informaciónla url es: "api/pokemon?name=pikachu&tuype=Elec")

api.post("/api/pokemons", (request, response) => {
    // para verificar que ingrese todos los parametros requeridos
    if (!request.body.name || !request.body.type) {
        response.status(400).send({
            success: false,
            url: "/api/pokemons",
            method: "POST",
            message: "name and type is required",
        });
    }

    // la información llega en request
    //Para crear un nuevo objeto en la db
    //0. leemos el fichero con readfile
    fs.readFile(dbPokemon, (err, data) => {
        const allPokemons = JSON.parse(data);
        //2. conseguimos el array
        //1. creamos el nuevo pokemon obteniendo los datos de request.query
        const newPokemon = {
            id: allPokemons.length + 1,
            name: request.body.name,
            type: request.body.type,
        };
        //3.  pusheamos el objeto en el array
        allPokemons.push(newPokemon);

        //4. introducimos el array con el nuevo item, parseando el array cin JSON.stringify(array)
        //5. si todo ha ido bien respondemo con un mensaje OK

        fs.writeFile(dbPokemon, JSON.stringify(allPokemons), (err) => {
            if (err) {
                response.status(400).send({
                    success: false,
                    url: "/api/pokemons",
                    method: "POST",
                    message: "FALLO al añadir pokemon",
                });
            } else {
                response.status(201).send({
                    success: true,
                    url: "/api/pokemons",
                    method: "POST",
                    message: newPokemon,
                });
                //request.query tengo los parametros de la querystring ( lo añadido en el postman, name, type)
            }
        });
    });
});
// DELETE

api.delete("/api/pokemons", (request, response) => {
    if (!request.body.id) {
        response.status(400).send({
            success: false,
            url: "/api/pokemons",
            method: "DELETE",
            message: "id is required",
        });
    } else {
        fs.readFile(dbPokemon, (error, data) => {
            const allPokemons = JSON.parse(data);
            const deletePokemon = {
                id: Number.parseInt(request.body.id),
            };
            const newAllPokemon = allPokemons.filter(
                (pokemon) => pokemon.id !== deletePokemon.id
            );
            //tratar el array
            fs.writeFile(dbPokemon, JSON.stringify(newAllPokemon), (err) => {
                if (err) {
                    response.status(400).send({
                        success: false,
                        url: "/api/pokemons",
                        method: "DELETE",
                        message: "fallo",
                        err: err,
                    });
                } else {
                    response.status(200).send({
                        success: true,
                        url: "/api/pokemons",
                        method: "DELETE",
                        message: "pokemon borrado correctamente",
                        deletePokemon: deletePokemon,
                    });
                }
            });
        });
    }
});

//GET ONE (para buscar un pokemon) por params

api.get("/api/onepokemon", (request, response) => {
    if (!request.query.id) {
        // o request.body.id
        response.status(400).send({
            success: false,
            url: "/api/onepokemon",
            method: "GET",
            message: "id is required",
        });
    } else {
        fs.readFile(dbPokemon, (err, data) => {
            if (err) {
                response.status(400).send({
                    success: false,
                    url: "/api/onepokemon",
                    method: "GET",
                    err: err,
                });
            } else {
                const allPokemons = JSON.parse(data);
                //conseguir el pokemon que se pide
                onePokemon = allPokemons.find(
                    (pokemon) => pokemon.id === Number.parseInt(request.query.id)
                );
                // onePokemon = "";
                response.status(201).send({
                    success: true,
                    url: "/api/onepokemons",
                    method: "GET",
                    message: "pokemon encontrado correctamente",
                    pokemon: onePokemon,
                });
            }
        });
    }
});

// GET por params sin poner id
api.get("/api/pokemons/:id", (request, response) => {
    const idPokemon = request.params.id;
    fs.readFile(dbPokemon, (err, data) => {
        const allPokemons = JSON.parse(data);
        const pokemon = allPokemons.find(
            (pokemon) => pokemon.id === Number.parseInt(idPokemon)
        );
        response.status(200).send({
            success: true,
            url: "/api/onepokemons",
            method: "GET",
            message: "pokemon encontrado correctamente",
            pokemon: pokemon,
        });
    });
});
//PUT , buscar el id y editar información
/*api.put("/api/pokemons/:id", (request, response) => {
    const idPokemon = request.params.id;
    let newType = request.body.type;
    fs.readFile("db/dbPokemon.json", (err, data) => {
        if (err) {
            response.status(500).send({
                success: false,
                url: "/api/pokemons/:id",
                method: "PUT",
                err: err,
            });
        } else {
            const allPokemons = JSON.parse(data);
            const newPokemon = allPokemons.find(
                (pokemon) => pokemon.id === Number.parseInt(idPokemon)
            );
            const ubicarPokemon = allPokemons.indexOf(newPokemon);
            allPokemons[ubicarPokemon].type = newType;
            fs.writeFile("db/dbPokemon.json", JSON.stringify(allPokemons), (err) => {
                response.status(201).send({
                    success: true,
                    url: "/api/pokemons",
                    method: "PUT",
                    message: newPokemon,
                });
            });
        }
    });
});*/
/* otro resultado PUT*/
/*api.put("/api/pokemons/:id", (request, response) => {
    fs.readFile(dbPokemon, (err, data) => {
        if (err) throw err;
        const allPokemonsUpdate = JSON.parse(data);
        allPokemonsUpdate.forEach((pokemon) => {
            if (pokemon.id === Number.parseInt(request.params.id)) {
                /*if (request.body.type)   */
pokemon.type = request.body.type; * /
/*pokemon.type = request.body.type ? request.body.type : pokemon.type;
                pokemon.name = request.body.name ? request.body.name : pokemon.name;
            }
        });
        fs.writeFile(dbPokemon, JSON.stringify(allPokemonsUpdate), (err) => {
            if (err) throw err;
            response.status(200).send({
                success: true,
                url: "/api/pokemons",
                method: "PUT",
                message: "pokemon modificado correctamente",
                pokemon: request.params.id,
            });
        });
    });
});*/

//GET PAGINADO
/*api.get("/api/pokemons/page/:page", (request, response) => {
    fs.readFile(dbPokemon, (err, data) => {
        const allPokemons = JSON.parse(data);
        const PAGE_SIZE = 5;
        const numPages = Math.round(allPokemons.length / PAGE_SIZE); // p
        const page = request.params.page;
        const initPage = page * PAGE_SIZE - PAGE_SIZE;
        const endPage = page * PAGE_SIZE;
        const pagePokemons = allPokemons.slice(initPage, endPage);
        response.status(200).send({
            success: true,
            url: "/api/pokemons/page",

            message: "POKEDEX PAGINADO",
            numPages: numPages,
            page: page,
            pokemons: pagePokemons,
        });
    });
    //conseguir devolver los items según la pagina que se solicite
    //cada pagina debe contener 5 pokemons
});

//GET PAGINADO OFFSSET Y LIMIT
api.get("/api/pageoffset/pokemons", (request, response) => {
    fs.readFile(dbPokemon, (err, data) => {
        const offset = parseInt(request.query.offset); // Desde donde empieza
        const limit = parseInt(request.query.limit); // cantidad de pokemons
        const allPokemons = JSON.parse(data);
        const initPage = offset;
        const endPage = offset + limit;
        const pageoffsetPokemons = allPokemons.slice(initPage, endPage);
        response.status(200).send({
            success: true,
            url: "/api/pageoffset/pokemons",
            message: "POKEDEX offset",
            inicio: offset,
            pokemon: pageoffsetPokemons,
        });
    });
});

//GET Localizacion de pokemons
api.get(
    "/api/pokemons/:pokemonId/location/:locationId",
    (request, response) => {
        fs.readFile(dbPokemon, (err, data) => {
            const pokemonId = parseInt(request.params.pokemonId); // id pokemon
            const locationId = parseInt(request.params.locationId); // id de localizacion
            const allPokemons = JSON.parse(data);
            const pokemon = allPokemons.find((pokemon) => pokemon.id === pokemonId);
            const allLocations = pokemon.locations;
            const location = allLocations.find(
                (location) => location.id === locationId
            );
            response.status(200).send({
                success: true,
                url: "/api/pokemons/:pokemonId/location/:locationId",
                method: "GET",
                message: "Localizacion encontrada de pokemon",
                location: location,
                pokemon: pokemon,
            });
        });
    }
);

api.listen(1010, () => {
    console.log("POKEAPI corriendo en puerto 1010");
});*/

//NUEVOS CAMBIOS