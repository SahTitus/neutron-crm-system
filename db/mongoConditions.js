export const projection = {
    _id: 1,
    title: 1,
}

export const mongoSearchPipeline = ({ query, skip, limit }) => {
    const searchPipeline = [
        {
            $match: {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                ],
            },
        },
        {
            $project: projection,
        },
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ];

    return searchPipeline;
};