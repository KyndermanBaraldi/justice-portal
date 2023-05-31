import { useState, useEffect } from "react";
import Select from 'react-select'

export default function CodigoOAB() {

  const [codigo_oab, setCodigo] = useState<Object | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/codigoOAB');
        const json = await response.json();
        setCodigo(json.data);
      } catch (error) {
        console.error('Erro ao consultar a API:', error);
      }
    };

    fetchData();
  }, []);
  
  const [tiposSelecionados, setTiposSelecionados] = useState<string[]>(['Cível']);

  const handleTiposSelecionadosChange = (selectedOptions: { value: string; label: string }[]) => {
    const selectedValues = selectedOptions.map((option) => option.value);
    setTiposSelecionados(selectedValues);
  };

  const tiposSet = new Set(
    Object.values(codigo_oab || {})
    .map((item) => item.Tipo)
    .filter((tipo) => !tipo.includes(','))
  );

  const tipos: { value: string; label: string }[] = Array.from(tiposSet).map((tipo) => ({
    value: tipo,
    label: tipo,
  }));

function renderizarTabelas(codigo_tipo_dict: Object, tipoSelecionado: string[]): JSX.Element[] {
  const entradasFiltradas = Object.entries(codigo_tipo_dict)
      .filter(([, value]) => tipoSelecionado.length === 0 ||  tiposSelecionados.some((tipo) => value.Tipo.includes(tipo)))
      .sort(([codigoA], [codigoB]) => Number(codigoA) - Number(codigoB));

  return tipoSelecionado.map((tipo) => {
    
    const entradasTipo = entradasFiltradas.filter(([, value]) => value.Tipo.includes(tipo));

    return (
      <div key={tipo}>
        <h3>{tipo}</h3>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Natureza da Ação</th>
            </tr>
          </thead>
          <tbody>
            {entradasTipo.map(([codigo, valor]) => (
              <tr key={codigo}>
                <td>{codigo}</td>
                <td>{valor['Natureza da Ação']}</td>
              </tr> ))}
          </tbody>
        </table>
      </div>
    );
  });
}

  const tabela = codigo_oab ? renderizarTabelas(codigo_oab, tiposSelecionados) : <p>Carregando...</p>;
  return (
    <main>
      <Select
        id="long-value-select"
        instanceId="long-value-select"
        isMulti
        value={tiposSelecionados.map((tipo) => ({ value: tipo, label: tipo }))}
        options={tipos}
        onChange={handleTiposSelecionadosChange as any}
      />
      {tabela}
    </main>
  );
}