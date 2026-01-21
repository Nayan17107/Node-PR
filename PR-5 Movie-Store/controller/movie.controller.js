const MovieModel = require("../model/movie.model");

exports.dashboardPage = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = 2;
        let skip = (page - 1) * limit;

        // Search Logic
        let searchQuery = req.query.q || "";
        let filter = {};
        if (searchQuery) {
            filter = {
                $or: [
                    { title: { $regex: searchQuery, $options: "i" } },
                    { director: { $regex: searchQuery, $options: "i" } }
                ]
            };
        }

        // Sort Logic
        let sortOption = req.query.sort || "";
        let sortCriteria = {};
        if (sortOption === "title-asc") sortCriteria = { title: 1 };
        else if (sortOption === "release-newest") sortCriteria = { releaseDate: -1 };
        else if (sortOption === "release-oldest") sortCriteria = { releaseDate: 1 };
        else if (sortOption === "rating-high") sortCriteria = { rating: -1 };
        else if (sortOption === "rating-low") sortCriteria = { rating: 1 };

        let totalMovies = await MovieModel.countDocuments(filter);
        let totalPages = Math.ceil(totalMovies / limit);

        let movies = await MovieModel.find(filter)
            .sort(sortCriteria)
            .skip(skip)
            .limit(limit);
        
        return res.render("index", { 
            movies, 
            count: totalMovies,
            currentPage: page,
            totalPages: totalPages,
            searchQuery: searchQuery,
            sortOption: sortOption
        });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};

exports.addMovie = async (req, res) => {
    try {
        let posterPath = req.file ? req.file.filename : "";
        await MovieModel.create({ ...req.body, poster: posterPath });
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        let id = req.params.id;
        let movie = await MovieModel.findById(id);
        if (!movie) {
            console.log("movie is not found");
            return res.redirect("/");
        }
        await MovieModel.findByIdAndDelete(id);
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};

exports.editMovie = async (req, res) => {
    try {
        let id = req.params.id;
        let movie = await MovieModel.findById(id);
        if (!movie) {
            console.log("movie is not found");
            return res.redirect("/");
        }
        return res.render("editMovie", { movie });
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};

exports.updateMovie = async (req, res) => {
    try {
        let id = req.params.id;
        let movie = await MovieModel.findById(id);
        if (!movie) {
            console.log("movie is not found");
            return res.redirect("/");
        }

        let posterPath = movie.poster;
        if (req.file) {
            posterPath = req.file.filename;
        }

        await MovieModel.findByIdAndUpdate(
            id,
            {
                ...req.body,
                poster: posterPath
            },
            { new: true }
        );
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.redirect("/");
    }
};
