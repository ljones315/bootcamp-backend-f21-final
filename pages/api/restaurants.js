// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import mongo from '../../server/mongo'

export default async function handler(req, res) {
  const db = await mongo()
  const restaurants = db.collection('restaurants')

  const neighborhoods = db.collection('neighborhoods')

  const hood = req.query.neighborhood
  let bounds = null;

  if (hood) {
    let neighborhood = await neighborhoods.findOne({name : hood});
    bounds = {$geometry : neighborhood.geometry}
  }
  console.log(bounds)

  const cuisine = req.query.cuisine;
  const borough = req.query.borough;
  const neighborhood = req.query.neighborhood;
  const sort = req.query.sort_by;

  let findOptions = {};

  if (cuisine) {
    findOptions.cuisine = cuisine;
  }
  if (borough) {
    findOptions.borough = borough;
  }
  if (bounds) {
    findOptions['address.coord'] = {$geoWithin : bounds};
  }

  let sortOpts = {};

  if (sort) {
    sortOpts['grades.0.score'] = sort.split('.')[1] === 'asc' ? 1 : -1;
  }

  let page = req.query.page;
  let pageSize = req.query.pageSize;

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

  console.log(findOptions)

  const results = await restaurants.find(findOptions)
    .sort(sortOpts)
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();
  //console.log(results)
  res.status(200).json(results)
}
