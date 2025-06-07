import { Outlet } from 'react-router-dom'
import Navbar from './utilityComponents/navbar/Navbar'
import Footer from './utilityComponents/footer/Footer'

const Client = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

export default Client