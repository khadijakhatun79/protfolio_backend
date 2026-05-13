const ObjectId = require("mongoose").Types.ObjectId;
const moment = require("moment-timezone");
const { default: mongoose } = require("mongoose");
/**
 * @param {Model}  collection    - Mongoose model
 * @param {Object} query         - Express req.query
 * @param {Object} projection    - MongoDB projection
 * @param {Array}  searchFields  - Fields to apply searchTerm against
 * @param {Object} options       - Extra aggregation options ($lookup etc.)
 * @param {Object} initialFilters - Pre-set filters merged first (e.g. tenantFilter)
 */
const get_query = (
    collection,
    query,
    projection = {},
    searchFields = [],
    options = {},
    initialFilters = {},
) => {
    //query = {filter_name: ivet, filter_gender: male }
    let all = false;
    if (query?.all) {
        all = true;
    }
    // Start with any pre-set filters (e.g. tenantFilter from SaaS middleware)
    let filters = { ...initialFilters };
    let queryDate = {};
    //dynamic filter logic
    let queryFilters = Object.keys(query).filter((x) => x.includes("filter_"));
    if (queryFilters.length) {
        queryFilters.reduce((a, b) => {
            let filterKey = b.split("filter_")[1];
            if (query[b] === "true" || query[b] === "false") {
                a[filterKey] = query[b] === "true";
            } else if (filterKey === "role") {
                a[filterKey] = query[b];
            } else if (b.split("_")[1] === "reference") {
                console.log(b.split("_")[3]);
                if (query[b]) {
                    const field = "matched_docs" + "." + b.split("_")[3];
                    const regex = new RegExp(`\\b${query[b]}\\b`, "i");
                    filters[field] =
                        ObjectId.isValid(query[b]) === true
                            ? new ObjectId(query[b])
                            : { $regex: regex };
                    const Model = mongoose.model(b.split("_")[2]);
                    const collectionName = Model.collection.name;
                    options = {
                        ...options,
                        $lookup: {
                            from: collectionName,
                            localField: `${b.split("_")[2]}`,
                            foreignField: "_id",
                            as: "matched_docs",
                        },
                    };
                }
            } else if (b.split("_")[1] === "date") {
                if (query[b]) {
                    queryDate["$gte"] = moment
                        .tz(query[b], "Asia/Dhaka")
                        .toDate();
                    queryDate["$lte"] = moment
                        .tz(query[b], "Asia/Dhaka")
                        .hour(23)
                        .minute(59)
                        .second(59)
                        .millisecond(999)
                        .toDate();

                    filters[`${b.split("_")[1]}`] = queryDate;
                }
            } else if (ObjectId.isValid(query[b])) {
                a[filterKey] = new ObjectId(query[b]);
            } else {
                if (query[b] !== "") {
                    a[filterKey] = new RegExp(query[b], "i");
                }
            }
            return a;
        }, filters);
    }

    //dynamic search term logic
    if (query.searchTerm && searchFields?.length > 0) {
        const searchTerm = query.searchTerm;
        const searchRegex = new RegExp(searchTerm, "i");

        const searchConditions = searchFields?.map((field) => ({
            [field]: { $regex: searchRegex },
        }));

        filters["$or"] = searchConditions;
    }

    let sorts = {};
    //dynamic sorts logic
    let querySorts = Object.keys(query).filter((x) => x.includes("sort_"));
    if (querySorts.length) {
        querySorts.forEach((sortKey) => {
            let fieldName = sortKey.split("sort_")[1];
            sorts[fieldName] = query[sortKey] === "asc" ? 1 : -1;
        });
    } else {
        sorts["createdAt"] = -1; // Default sorting by createdAt field in descending order
    }

    let pageSize = query.pageSize ? parseInt(query.pageSize) : 10;
    let page = query.page ? parseInt(query.page) : 1;
    let skip = (page - 1) * pageSize;

    let projectionStage = {};
    if (Object.keys(projection).length > 0) {
        projectionStage = { $project: projection };
    }

    // Dynamic populate logic
    // if (options.populateFields && options.populateFields.length > 0) {
    // 	options.populateFields.forEach((populateField) => {
    // 		const Model = mongoose.model(populateField.model);
    // 		const collectionName = Model.collection.name;

    // 		options = {
    // 			...options,
    // 			$lookup: {
    // 				from: collectionName,
    // 				localField: populateField.localField,
    // 				foreignField: populateField.foreignField || "_id",
    // 				as: populateField.as || populateField.localField,
    // 			},
    // 		};
    // 	});
    // }

    //example populate fields
    // [
    // 	{ model: "User", localField: "userId", foreignField: "_id", as: "user" },
    // 	{ model: "Order", localField: "orderId", foreignField: "_id", as: "order" }
    // ]

    // dynamic query logic
    if (all) {
        const aggregateQuery = [{ $match: filters }, { $sort: sorts }];
        if (Object.keys(projectionStage).length > 0) {
            aggregateQuery.push(projectionStage);
        }

        return {
            data: collection.aggregate(aggregateQuery),
            meta: collection.aggregate([
                { $match: filters },
                { $count: "count" },
            ]),
            page,
            pageSize,
        };
    } else {
        const aggregateQuery = [
            { $match: filters },
            { $sort: sorts },
            { $skip: skip },
            { $limit: pageSize },
        ];

        if (Object.keys(projectionStage).length > 0) {
            aggregateQuery.push(projectionStage);
        }
        const countQuery = [{ $match: filters }];
        if (Object.keys(options).length > 0) {
            aggregateQuery.unshift(options);
            countQuery.unshift(options);
        }

        return {
            data: collection.aggregate(aggregateQuery),
            meta: collection.aggregate([...countQuery, { $count: "count" }]),
            page,
            pageSize,
        };
    }
};

module.exports = { get_query };
