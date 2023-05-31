import Carousel from "@/components/carousel/carousel";
import { useSession } from "next-auth/react"
import Image from 'next/image';

export default function Home() {

  const {data} = useSession();
  
  const images = [
    {
      src: "/carousel-tjsp.jpg",
      alt: "Image 1",
    },
    {
      src: "/carousel2-tjsp.jpg",
      alt: "Image 2",
    },
    {
      src: "/carousel3-tjsp.jpg",
      alt: "Image 3",
    },
    // Adicione mais objetos de imagem conforme necessário
  ];

  const teste = async () => {
 
    const token = data?.user.token;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}usuario/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao obter os detalhes do usuário');
        }
        response.json().then(data => {
          console.log(data);
        });
      })
      .then(userDetails => {
        // Manipule os detalhes do usuário conforme necessário
        console.log(userDetails);
      })
      .catch(error => {
        // Lida com erros de requisição
        console.error(error);
      });
  }

  return (
    <>
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem',
          width: '100vw',
          height: '90vh',
          overflow: 'hidden',
          fontFamily: 'Roboto, sans-serif',
          background: 'var(--backgroundColorDark)'
        }}>
        
        <h1
          style={{
            fontSize: '5rem',
            fontWeight: 'bold',
            color: 'var(--secondaryColor)',
            zIndex: 1,
          }}
        >
          Liga da Justiça #TJSP
        </h1>
        <h2
          style={{
            fontSize: '2.2rem',
            fontWeight: 'bold',
            color: 'var(--mainColor)',
            
          }}
        >
          Um portal feito para Super-Escreventes
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: "repeat(3, 1fr)",
            width: '100%',
            marginTop: '3rem',
            padding: '2rem',
            gap: '2rem',
          }}
        >

          <div
            style={{
              background: 'var(--backgroundColor)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'left',
              width: '500px',
              gap: '2rem',
              color: '#29335c',
              border: '2px solid #db2b39',
              padding: '2rem',
              borderRadius: '10px',
            }}
          >
            <h3 style={{color: '#db2b39'}}>Próximos feriados</h3>

            <p>08/06/2023	CORPUS-CHRISTI</p>

            <p>09/06/2023	Suspensão do expediente</p>

            <p>06/08/2023	SENHOR BOM JESUS</p>

            <p>07/09/2023	INDEPENDÊNCIA DO BRASIL</p>

            <p>08/09/2023	Suspensão do expediente</p>

          </div>
          
          <Carousel images={images} width={500} height={350}/>

          <div
            style={{
              background: 'var(--backgroundColor)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'left',
              width: '500px',
              gap: '2rem',
              color: '#29335c',
              border: '2px solid #db2b39',
              padding: '2rem',
              borderRadius: '10px',
            }}
          >
            <h3 style={{color: '#db2b39'}}>Dicas de produtividade:</h3>
            <p>As pessoas perguntam como é possível conciliar várias atividades.</p>
            <p>- O segredo é fazer tudo mal feito.</p>
            <p style={{textAlign: 'end'}}>Fonte: sans-serif.</p>

          </div>

        </div>

        <Image
          style={{
            position: 'absolute',
            bottom: '2rem',
            right: '24rem',
            transform: 'rotate(-10deg)'
          }}
          src="/escrevente-vestido-como-super-heroi.png"
          alt="Escrevente vestido como super heroi"
          width={423}
          height={600}
        />
      </main>
    </>
  )
}
