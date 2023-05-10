import { useSession } from "next-auth/react";


export default function CertificarPrazo() {
  
  // const {singout, email} = useAuth();
  const { data } = useSession()

  const getData = async () => {
    const response = await fetch('http://localhost:5001/processo/10021068720228260634')
    const data = await response.json()
    console.log(data)
  }

  return (

    <div>
      <h1>dashboard</h1>
      <p>Olá {data?.user.name}</p>

      <button onClick={getData}>Get Data</button>
    </div>
    
  )

}