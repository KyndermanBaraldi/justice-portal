import { useState, useEffect } from "react";

type Zona = {
    codigo: string,
    bairro: string,
    zona: string,
    cidade: string,
  }

export default function Zonas() {

    const [zonas, setZona] = useState<Array<Zona> | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/zonas');
        const json = await response.json();
        setZona(json.data);
      } catch (error) {
        console.error('Erro ao consultar a API:', error);
      }
    };

    fetchData();
  }, []);

    return (
        <main>
           {zonas && zonas.map((zona) => (
                <div key={zona.codigo}>
                    <span>{zona.bairro} - {zona.zona}</span>
                </div>
            ))}
        </main>
    )
  }
  