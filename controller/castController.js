const path = require("path");
const fs = require("fs").promises;
const { success, failure } = require("../common");
const castModel = require("../model/user")
const moviesModel = require("../model/movies")
const directorsModel = require("../model/director")
const buyersModel = require("../model/buyer")
const mangasModel = require("../model/mangas")
const transactionsModel = require("../model/transaction")
const cartModel = require("../model/cart")
const checkoutModel = require("../model/checkouts")
const express = require("express")
const app = express();
const { validationResult } = require("express-validator");
const userModel = require("../model/user2");
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

    async addToCart(req, res) {
        try {
            const { user, mangas } = req.body;
            const userItem = await userModel.findById(user.id);
            let cartItem;
            if (!userItem) {
                return res.status(404).send(failure(`user with ID ${user.id} not found`));
            }
            console.log("userItem", userItem)
            let total = 0;
            let flag = false;

            for (const manga of mangas) {
                const mangaItem = await mangasModel.findById(manga.id);

                console.log(mangaItem, "mangaItem")

                if (!mangaItem) {
                    return res.status(404).send(failure(`Manga with ID ${manga.id} not found`));
                }

                if (mangaItem.stock < manga.quantity) {
                    return res.status(200).send(failure(`Insufficient stock for manga ${mangaItem.name}`));
                }

                cartItem = await cartModel.findById(userItem.cartId);
                if (cartItem) {
                    flag = true;
                    const existingManga = cartItem.mangas.find(cartManga => cartManga.id.equals(mangaItem._id));
                    if (existingManga) {
                        // increase the quantity
                        console.log("if block is working")
                        existingManga.quantity += manga.quantity;
                    } else {
                        console.log("else block is working")
                        // push manga
                        cartItem.mangas.push({
                            id: mangaItem._id,
                            quantity: manga.quantity,
                        });
                    }

                }



                let subtotal = mangaItem.price * manga.quantity;
                total += subtotal;
            }

            if (!(flag)) {
                const newCart = new cartModel({ user, mangas, total });
                await newCart.save()
                    .then((data) => {
                        userItem.cartId = data._id;
                        userItem.save();
                        return res.status(200).send(success("One cart has been created", { Transaction: data }));
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(500).send(failure("Failed to add the cart"));
                    });

            }
            else {
                cartItem.total += total
                await cartItem.save()
                    .then((data) => {
                        return res.status(200).send(success("Existing cart updated", { Transaction: data }));
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(500).send(failure("Failed to update the cart"));
                    });
            }
        }
        catch (error) {
            console.log("Error while creating transaction", error);
            return res.status(500).send(failure("Internal server error"));
        }

    }
    async deleteFromCart(req, res) {
        try {
            const { user, mangas } = req.body;
            const userItem = await userModel.findById(user.id);
            let cartItem;
            if (!userItem) {
                return res.status(404).send(failure(`user with ID ${user.id} not found`));
            }
            console.log("userItem", userItem)
            let total = 0;
            let flag = false;
            cartItem = await cartModel.findById(userItem.cartId);
            if (cartItem) {
                const existingManga = cartItem.mangas.find(cartManga => cartManga.id.equals(mangas[0].id));
                if (existingManga) {
                    if (mangas[0].quantity > existingManga.quantity) {
                        return res.status(404).send(failure(`Insufficient amount. Can not delete ID ${mangas[0].id}`));
                    }
                    else if (mangas[0].quantity === existingManga.quantity) {
                        
                        const mangaIndex = cartItem.mangas.findIndex(cartManga => cartManga.id.equals(mangas[0].id));
                        if (mangaIndex !== -1) {
                            cartItem.mangas.splice(mangaIndex, 1);
                            await cartItem.save()
                                .then((data) => {
                                    return res.status(200).send(success("Cart is updated,product removed", { Transaction: data }));
                                })
                                .catch((err) => {
                                    console.log(err);
                                    return res.status(200).send(failure("Failed to delete the product from cart"));
                                });
                        }
                    } else {
                       
                        existingManga.quantity -= mangas[0].quantity;
                        const mangaItem = await mangasModel.findById(mangas[0].id);
                        const sub = mangas[0].quantity * mangaItem.price
                        cartItem.total -= sub

                        console.log("ExistingManga", existingManga)

                        await cartItem.save()
                            .then((data) => {
                                return res.status(200).send(success("Cart is updated,", { Transaction: data }));
                            })
                            .catch((err) => {
                                console.log(err);
                                return res.status(500).send(failure("Failed to delete certain amount from cart"));
                            });
                    }

                }
                else {
                    return res.status(200).send(failure(`No product found of the ID ${mangas.id}`));
                }

            }
            else {
                return res.status(200).send(failure(`No cart found for the user ${user.id}`));
            }


        }
        catch (error) {
            console.log("error while deleting", error)
            return res.status(500).send(failure(`Internal server error`));

        }
    }
    async checkout(req, res) {
        try {
            const { user } = req.body;
            const userItem = await userModel.findById(user.id);
            let cartItem;
            if (!userItem) {
                return res.status(200).send(failure(`user with ID ${user.id} not found`));
            }
            cartItem = await cartModel.findById(userItem.cartId);
            if (cartItem) {
                if ((cartItem.checked)) {
                    return res.status(200).send(failure(`You order is on the way`));
                }
                // Iterate through the mangas in the cart
                for (const cartManga of cartItem.mangas) {
                    const mangaItem = await mangasModel.findById(cartManga.id);
                    if (mangaItem) {
                        if (cartManga.quantity > mangaItem.stock) {
                            return res.status(200).send(failure(`Insufficient stock for manga ${mangaItem.name}`));
                        }
                    } else {
                        return res.status(200).send(failure(`Manga with ID ${cartManga.id} not found`));
                    }
                }

              
                for (const cartManga of cartItem.mangas) {
                    const mangaItem = await mangasModel.findById(cartManga.id);
                    mangaItem.stock -= cartManga.quantity;
                    await mangaItem.save();
                }

       

                const newCheckout = new checkoutModel({
                    cart: cartItem._id,
                    user: userItem._id,
                    mangas: cartItem.mangas,
                    total: cartItem.total
                });
                cartItem.mangas = [];
                cartItem.total = 0;
                cartItem.checked = true;
                await cartItem.save();
                await newCheckout.populate("user mangas.id");
                await newCheckout.save()
                    .then((data) => {
                        return res.status(200).send(success("Order successful", { Order: data }));
                    })
                    .catch((err) => {
                        console.log(err);
                        return res.status(500).send(failure("Failed to checkout"));
                    });




            }
            else {
                return res.status(200).send(failure(`No cart found for the user`));
            }



        }
        catch (error) {
            console.log("error while checking out", error)
            return res.status(500).send(failure(`Internal server error`));
        }

    }

    async getAllMangas(req, res) {
        // object destructuring
        let { page, limit, searchParam, price, order, priceFlow, sortField, category, stockFlow, stock, priceUpperBound, priceLowerBound, rate, rateFlow } = req.query;
        try {
            console.log("{page,limit}", page, limit);

            // Create a query object
            const query = {};
            if (!(page)) {
                page = 1
            }
            if (!(limit)) {
                limit = 5
            }
            if (page < 1 || limit < 0) {
                return res.status(200).send(success("Page and limit must be valid"));
            }

            // creates regular expression
            if (searchParam) {
                const regex = new RegExp(searchParam, 'i'); // 'i' flag for case-insensitive search
                query.$or = [{ name: regex }, { author: regex }]; //or operation
            }
            if (stock) {
                if (isNaN(parseFloat(stock))) {
                    return res.status(200).send(success("stock must be valid numbers."));
                }
            }

            if (stock && (stockFlow === 'upper' || stockFlow === 'lower')) {

                const stockFilter = stockFlow === 'upper' ? { $gte: parseFloat(stock) } : { $lte: parseFloat(stock) };
                query.stock = stockFilter;
            }
            else if (stock) {
                const stockFilter = { $eq: parseFloat(stock) }
                query.stock = stockFilter;
            }
            if (price) {
                if (isNaN(parseFloat(price))) {
                    return res.status(200).send(success("Price must be valid numbers."));
                }
            }
            if (price && (priceFlow === 'upper' || priceFlow === 'lower')) {

                if (priceFlow === 'upper') {
                    query.price = { $gte: parseFloat(price) };
                } else {
                    query.price = { $lte: parseFloat(price) };
                }


            }
            else if (price) {
                query.price = {
                    $eq: parseFloat(price)
                };
            } else if (priceUpperBound && priceLowerBound) {
                if (isNaN(parseFloat(priceLowerBound)) || isNaN(parseFloat(priceUpperBound))) {
                    return res.status(200).send(success("Both bounds must be valid numbers."));
                }
                if (parseFloat(priceLowerBound) > parseFloat(priceUpperBound)) {
                    return res.status(200).send(success("Invalid price range"));
                }
                query.price = {
                    $gte: parseFloat(priceLowerBound),
                    $lte: parseFloat(priceUpperBound),
                };
            }

            if (rate) {
                if (isNaN(parseFloat(rate))) {
                    return res.status(200).send(success("rate must be valid numbers."));
                }
            }
            if (rate && (rateFlow === 'upper' || rateFlow === 'lower')) {

                if (rateFlow === 'upper') {
                    query.rate = { $gte: parseFloat(rate) };
                } else {
                    query.rate = { $lte: parseFloat(price) };
                }


            }
            else if (rate) {
                query.rate = {
                    $eq: parseFloat(rate)
                };
            }

            // pagination
            const options = {
                skip: (page - 1) * limit,
                limit: parseInt(limit),
            };
            // valid fields 
            const validSortFields = ['name', 'author', 'price', 'stock', 'id', 'rate'];
            if (sortField) {
                // query param valid or not
                if (!validSortFields.includes(sortField)) {
                    return res.status(200).send(success("Invalid sortField parameter"));
                }

            }
            if (sortField && !(order)) {
                if (!validSortFields.includes(sortField)) {
                    return res.status(200).send(success("Invalid sortField parameter"));
                }
                options.sort = { [sortField]: 1 }; // Ascending order by default
            }

            // Sort based on any field in ascending or descending order
            if (order) {
                if (order === 'asc') {
                    options.sort = { [sortField]: 1 }; // Ascending order
                } else if (order === 'desc') {
                    options.sort = { [sortField]: -1 }; // Descending order
                } else {
                    return res.status(200).send(success("priceOrder parameter is invalid"));
                }
            }

            if (category && Array.isArray(category)) {
                query.category = { $in: category };
            } else if (category) {
                query.category = category;
            }


            // Find documents that match the query
            const mangas = await mangasModel.find(query, null, options);


            if (mangas.length > 0) {
                console.log(mangas);
                return res.status(200).send(success("Successfully received", mangas));
            }
            if (mangas.length == 0) {
                return res.status(200).send(success("No mangas were found"));
            }


        } catch (error) {
            console.log("Catch", error);
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
