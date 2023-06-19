
import Carousel from "@/components/carousel/carousel";
import styles from "@/styles/Home.module.css";

export default function Home() {
  
  
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
    const data = await fetch("/api/user");
    const json = await data.json();
    console.log(json);
  }

  return (
    <>
      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Liga da Justiça #TJSP
          </h1>
          <h2 className={styles.subtitle}>
            Um portal feito para Super-Escreventes
          </h2>

        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Próximos feriados</h3>
            <p>08/06/2023 CORPUS-CHRISTI</p>
            <p>09/06/2023 Suspensão do expediente</p>
            <p>06/08/2023 SENHOR BOM JESUS</p>
            <p>07/09/2023 INDEPENDÊNCIA DO BRASIL</p>
            <p>08/09/2023 Suspensão do expediente</p>
          </div>

          <Carousel images={images} width={550} height={380} />

        </div>

        {/* <button onClick={teste}>teste</button> */}
      </main>
    </>
  );
}
