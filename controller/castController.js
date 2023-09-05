const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../common");
const castModel = require("../model/user")
const moviesModel = require("../model/movies")
const directorsModel = require("../model/director")
const buyersModel = require("../model/buyer")
const mangasModel = require("../model/mangas")
const transactionsModel = require("../model/transaction")
const express = require("express")
const app = express();
const { validationResult } = require("express-validator");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
class castController {
    async getAll(req, res) {
        try {
            const casts = await castModel.find({});
            if (casts.length > 0) {
                console.log(casts);
                return res.status(200).send(success("Successfully recieved", casts));
            }
            return res.status(200).send(success("No casts were found"));
        }
        catch (error) {
            console.log("Catch", error)
            return res.status(500).send(success("Internal server error"));
        }

    }

    async create(req, res) {
        try {
            const { name, notable_films, awards } = req.body;
            const cast = new castModel({ name, notable_films, awards })
            const casts = await castModel.find({});
            const nameExists = casts.some(item => item.name === req.body.name);

            if (nameExists) {
                return res.status(404).send(success({ message: "Given name already exists" }));
            }


            await cast.save().
                then((data) => {
                    return res.status(200).send(success("Successfully added the user", data));
                }).
                catch((err) => {
                    console.log(err);
                    return res.status(200).send(failure("Failed to add the user"));

                });
            // return res.status(200).send(success("Successful", cast));
        }
        catch (error) {
            console.log("Error while creating", error);
            return res.status(500).send(success("Couldnt create a new cast"));
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.query;
            console.log("Paramsssss", req.query)
            console.log("IDDDD", id)
            const cast = await castModel.findById({ _id: id });
            if (cast) {
                return res.status(200).send(success("Successfully could retrieve data", cast));
            }
            else {
                return res.status(200).send(success("Failed to recieve data"));
            }

        }
        catch (error) {
            console.log("Error while finding by id", error);
            return res.status(500).send(success("Couldnt find the cast"));

        }
    }
    async deleteById(req, res) {
        try {
            const { id } = req.query;
            console.log("Paramsssss", req.query)
            console.log("IDDDD", id)
            const cast = await castModel.deleteOne({ _id: id });
            if (cast) {
                return res.status(200).send(success("Successfully could delete data", cast));
            }
            else {
                return res.status(200).send(success("Couldnt find any data for deleting"));
            }

        }
        catch (error) {
            console.log("Error while deleting by id", error);
            return res.status(500).send(success("Failed to delete data"));

        }

    }

    async getByImdb(req, res) {
        try {
            const { imdb } = req.body;
            console.log("const {imdb}=req.body;", typeof (imdb))
            const movies = await moviesModel.find({ imdb: { $gte: req.body.imdb } });
            if (movies) {
                return res.status(200).send(success("Successfully could retrieve data", movies));
            }
            else {
                return res.status(200).send(success("Failed to recieve data"));
            }

        }
        catch (error) {
            console.log("Error while finding by id", error);
            return res.status(500).send(success("Couldnt find the movie"));

        }

    }
    async updateMovie(req, res) {
        try {
            const { id } = req.query;
            console.log("Paramsssss", req.query)
            console.log("IDDDD", id)
            const cast = await moviesModel.findById({ _id: id });
            console.log("cast", cast)
            if (!(cast)) {
                return res.status(404).send(success("Data not found"));
            }

            const { updatedValue } = req.body;

            // item[key] = value;
            const updatedMovie = await moviesModel.findOneAndUpdate(
                { _id: id },
                { $set: updatedValue },
                { new: true }
            );
            console.log("Updating matching items", updatedMovie);





            if (updatedMovie) {
                return res.status(200).send(success("Successfully updated movie", updatedMovie));
            } else {
                return res.status(404).send(failure("Movie not found"));
            }
        } catch (error) {
            console.log("Error while updating movie", error);
            return res.status(500).send(failure("Failed to update movie"));
        }
    }

    async createTransaction(req, res) {
        try {
            const { buyer, mangas } = req.body;

            for (const manga of mangas) {
                const mangaItem = await mangasModel.findById(manga.id);

                console.log(mangaItem, "mangaItem")

                if (!mangaItem) {
                    return res.status(404).send(failure(`Manga with ID ${manga.id} not found`));
                }

                if (mangaItem.stock < manga.quantity) {
                    return res.status(400).send(failure(`Insufficient stock for manga ${mangaItem.name}`));
                }


                mangaItem.stock -= manga.quantity;
                await mangaItem.save();
            }


            const newTransaction = new transactionsModel({ buyer, mangas });

            await newTransaction.save()
                .then((data) => {
                    return res.status(200).send(success("One transaction has been created", { Transaction: data }));
                })
                .catch((err) => {
                    console.log(err);
                    return res.status(500).send(failure("Failed to add the transaction"));
                });
        } catch (error) {
            console.log("Error while creating transaction", error);
            return res.status(500).send(failure("Internal server error"));
        }
    }

    async getAllMangas(req, res) {
        try {
            const casts = await mangasModel.find({});
            if (casts.length > 0) {
                console.log(casts);
                return res.status(200).send(success("Successfully recieved", casts));
            }
            return res.status(200).send(success("No casts were found"));
        }
        catch (error) {
            console.log("Catch", error)
            return res.status(500).send(success("Internal server error"));
        }

    }


    async getAllTransactions(req, res) {
        try {
            const { pass } = req.query;
            let transaction;
            if (pass && pass != "123") {
                return res.status(200).send(failure("Invalid parameter"))
            }
            if (pass === "123") {
                transaction = await transactionsModel.find({})
                    .populate(
                        'buyer.id', "-_id"

                    )
                    .populate(
                        'mangas.id', "-_id"

                    );

            }
            if (transaction.length > 0) {
                return res.status(200).send(success("Here is your transactions", transaction))
            }
            else {
                return res.status(200).send(failure("No transaction to show"))
            }

        }
        catch (error) {
            console.log("Internal Server error", error)
            return res.status(500).send(success("Internal Server Error"));

        }
    }

    async addTransaction(req, res) {
        try {
            const { id } = req.query;
            const { mangaIdd, amount } = req.body;
            console.log("transaction Id", id)

            const existingTransaction = await transactionsModel.findById(id);

            if (!existingTransaction) {
                return res.status(404).send(failure("Transaction not found"));
            }
            const existingManga = existingTransaction.mangas.find((m) => m.id.toString() === mangaIdd);
            if (existingManga) {

                existingManga.amount += amount;
                const updatedTransaction = await existingTransaction.save();
                return res.status(200).send(success("Manga added to the transaction", updatedTransaction));
            } else {


                const manga = await mangasModel.findById(mangaIdd);

                if (!manga) {
                    return res.status(404).send(failure(`Manga with ID ${mangaIdd} not found`));
                }

                if (manga.stock < amount) {
                    return res.status(400).send(failure(`Insufficient stock for manga ${manga.name}`));
                }


                const mangaObject = {
                    id: mangaIdd,
                    amount,
                };
            }

            existingTransaction.mangas.push(mangaObject);


            manga.stock -= amount;
            await manga.save();

            // Save the updated transaction with the new manga
            const updatedTransaction = await existingTransaction.save();

            return res.status(200).send(success("Manga added to the transaction", updatedTransaction));
        } catch (error) {
            console.log("Error while adding manga to transaction", error);
            return res.status(500).send(failure("Internal server error"));
        }
    }


    async transactionPrice(req, res) {
        try {
            const { id } = req.query;
            // const transaction2=await transactionsModel.findById(id);
            // console.log("transaction2",transaction2,"id",id)
            const transaction = await transactionsModel.findById(id).populate('mangas.id');

            if (!transaction) {
                return res.status(200).send(success("No transaction to show"));
            }

            let totalPrice = 0;
            for (const mangaTransaction of transaction.mangas) {
                const { id, quantity } = mangaTransaction;

                const manga = await mangasModel.findById(id);

                if (manga) {

                    const mangaPrice = manga.price * quantity;

                    totalPrice += mangaPrice;
                }
            }

            console.log("totalPrice", totalPrice);
            return res.status(200).send(success("The total price of the given transaction", totalPrice));
        } catch (error) {
            console.error("Error calculating total price:", error);
            return res.status(500).send(failure("Internal Server errror"));
        }
    }








    async notFound(req, res) {
        return res.status(404).send(success({ message: "URL Not found" }));
    }
}
module.exports = new castController();
