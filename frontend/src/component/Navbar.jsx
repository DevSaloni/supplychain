import React,{useState,useEffect} from 'react'
import {Link,useNavigate} from  "react-router-dom";
import Home from '../pages/Home';
import "./Navbar.css";

const Navbar = () => {
   const navigate = useNavigate();
   const[accounts,setAccounts] = useState();
   const [menuOpen, setMenuOpen] = useState(false);

    //handle selected dashbaord
    const handleSelect = (e)=>{
        if(e.target.value){
            navigate(`/dashboard/${e.target.value}`);
        }
    }
    
    // TODO: wallet connect logic 
    const connectWallet = async()=>{
        //request to metamask wallet
        if(window.ethereum){
        try{
          const account = await window.ethereum.request({
            method:"eth_requestAccounts",
          })
          setAccounts(account[0]);
        }catch(err){
            console.error("User rejected request",err);
        }
        }else{
        alert("MetaMask not found! Please install MetaMask.");
        }
    }

    //auto load if account is already connected 
     useEffect(()=>{
        if(window.ethereum){
            window.ethereum.request({method:"eth_accounts"}).then((account)=>{
                if(account.length>0){
                    setAccounts(account[0]);
                }
            })
        }

        //listen account change
        window.ethereum.on("accountsChanged", (account) =>{
            setAccounts(account[0] || null);
        })
        },[]);

  return (
    <div className='navbar-container'>
       <div className='logo'>
        <img src="/red-tick.png" className='logo-img' alt="logo" />
        <h2>VeriTrack</h2>
    </div>
    
    {/* Hamburger Icon (☰) */}
      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
        <div className={`navbar-list ${menuOpen ? "active" : ""}`}>
            <li>
                <Link to="/">HOME</Link>
            </li>

            <li>DASHBOARD
            <select className='select-container' onChange={handleSelect}>
                <option value="">Select Role</option>
                <option value="manufacture">MANUFACTURE</option>
                <option value="transporter">TRANSPORTER</option>
                <option value="retailer">RETAILER</option>
            </select>
            </li>
           
           <li>
                <Link to="/product-search">PRODUCT</Link>
            </li>
            <li>
                <Link to="/about">ABOUT</Link>
            </li>
            <li>
               <Link to="/contact">CONTACT US</Link>
            </li>



            {accounts?(
            <button className='wallet-btn'>
            {accounts.slice(0,6)}...{accounts.slice(-4)}
            </button>
           ):(
            <button className='wallet-btn' onClick={connectWallet}>CONNECT WALLET</button>
            )}
        </div>
    </div>   
  )
}

export default Navbar