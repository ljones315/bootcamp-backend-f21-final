// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongo from '../../server/mongo'

export default async function handler(req, res) {
  const db = await mongo()
  const restaurants = db.collection('restaurants')

  const cuisine = req.query.cuisine;
  const borough = req.query.borough;
  const neighborhood = req.query.neighborhood;
  const sort = req.query.sort_by;

  let findOptions = {};

  if (cuisine) {
    findOptions.cuisine = cuisine;
  }
  if (neighborhood) {
    findOptions.neighborhood = neighborhood;
  }
  if (borough) {
    findOptions.borough = borough;
  }

  let sortOpts = {};

  if (sort) {
    sortOpts['grades.0.score'] = sort.split('.')[1] === 'asc' ? 1 : -1;
  }

  let page = req.query.page;
  let pageSize = req.query.pageSize;
  console.log(req.query)

  if (!pageSize) {
    pageSize = 10;
  } else {
    pageSize = parseInt(pageSize);
  }

  if (!page) {
    page = 1;
  } else {
    page = parseInt(page);
  }

  console.log(pageSize);


  const results = await restaurants.find(findOptions)
    .sort(sortOpts)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();
  //console.log(results)
  res.status(200).json(results)
}
