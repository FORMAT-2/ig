const {baseInstance} = require('../../base')
const axios = require('axios');
// https://graph.facebook.com/oauth/access_token
//   ?client_id={your-app-id}
//   &client_secret={your-app-secret}
//   &grant_type=client_credentials


const getToken = async(req,res)=>{
    const response = await axios.get("https://graph.facebook.com",{
        params:{
            client_id:447452908193993,
            client_secret:"5c5dcb65a02a81cebbae51c215e206be",
            grant_type:"client_credentials"
        }
    })

    console.log(response);
}
const fetchUser  = async(req,res)=>{
    const response = await axios.get('https://graph.facebook.com/me',{
            params: {
                access_token: 'EAAGW9LZBliMkBO1UkqI6Ioz9pOye7wQkfpKX7KekVIu847MDPDpfG0GKqrDMQll3jVN4GZAVlaUXyepfiEjJrlQNN6iCnVaS7v7RDsYhl44FQhCbiSfGGUl4Hia6j95HcAijBQtGm1nz5W3t16ZCJUxncM3pPJ8jvAQryun9DeaonTeigAm2euTEZByF7w3cPDPILEcZAv2OwHCWCIt5omjzNsQZDZD'
            }
        })
        console.log(response);


}


module.exports= {fetchUser,getToken};