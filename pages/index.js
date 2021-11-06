import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import RestaurantRow from '../components/RestaurantRow'
import { useEffect, useState } from 'react'
import Select from '../components/Select'
import dummyRestaurants from '../dummy'

export default function Home() {
  const [borough, setBorough] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [grades, setGrades] = useState('')
  const PAGE_SIZE = 10
  const page = 1;

  const [selects, setSelects] = useState({
    borough: ['dummy', 'dummy1', 'dummy 3'],
    cuisine: ['cuisine1', 'cuisine2', 'cuisine3'],
    neighborhood: [...Array(50).keys()]
  })
  const gradeSelects = ['asc', "desc"]

  const [restaurants, setRestaurants] = useState(dummyRestaurants)

  useEffect(() => {
    const filters = Promise.all([
      fetchHelper('/api/categories/boroughs'),
      fetchHelper('/api/categories/cuisines'),
      fetchHelper('/api/categories/neighborhoods'),
      fetchHelper(`/api/restaurants?page=${page}&pageSize=${PAGE_SIZE}`)
    ])
    filters.then(([boroughs, cuisines, neighborhoods, restaurants])=>{
      if (restaurants) setRestaurants(restaurants)
      if (!boroughs || !cuisines || !neighborhoods) return
      setSelects({
        borough: boroughs,
        cuisine: cuisines,
        neighborhood: neighborhoods
      })
    })
  },[])

  const fetchHelper = async (path) => {
    return fetch(path).then(r=>r.json())
  }

  const getRestaurants = () => {
    let params = `?page=${page}&pageSize=${PAGE_SIZE}`
    if (cuisine != '') params += `&cuisine=${encodeURIComponent(cuisine)}`
    if (borough != '') params += `&borough=${encodeURIComponent(borough)}`
    if (neighborhood != '') params += `&neighborhood=${encodeURIComponent(neighborhood)}`
    if (grades != '') params += `&sort_by=grades.${encodeURIComponent(grades)}`
    console.log(params + 'p');
    fetchHelper(`/api/restaurants${params}`).then(res => {
      setRestaurants(res)
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>NYC Restaurant App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to our NYC Restaurant App!
        </h1>
        
        <Select label="Borough" options={selects.borough} curr={borough} onChange={setBorough}/>
        <Select label="Cuisine" options={selects.cuisine} curr={cuisine} onChange={setCuisine}/>
        <Select label="Neighborhood" options={selects.neighborhood} curr={neighborhood} onChange={setNeighborhood}/>
        <Select label="Orders" options={gradeSelects} curr={grades} onChange={setGrades}/>
        <button onClick={()=>getRestaurants()}>Apply Filters</button>

        {restaurants.map((r,i)=> <RestaurantRow key={r.restaurant_id} restaurant={r}/>)}
        
        
      </main>

      <footer className={styles.footer}>
        <a
          href="https://bitsofgood.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="https://images.ctfassets.net/zifivti966xh/5nCe2OcagxfVoASgu6YTYs/f986599793cf7a7a04171a1ff26d3e50/bog-logo-footer.svg" alt="Vercel Logo" width={96} height={20} />
          </span>
        </a>
      </footer>
    </div>
  )
}
