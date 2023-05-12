import { useState } from "react";
import { JsxElement } from "typescript";

/*
hook que recebe uma lista de components e retorna o componente atual, 
o index, uma função para avançar para o próximo, uma função para voltar
para o anterior e uma variável que indica se o componente atual é o
último da lista.
*/

const useSteps = (steps: Array<JsxElement>) => {
    const [index, setIndex] = useState(0);
    const isLast = (index === steps.length - 1);
    const currentStep = steps[index];

    const nextStep = () => {
        if (!isLast) {
            setIndex(index + 1);
        }
    };

    const prevStep = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    return { currentStep, index, nextStep, prevStep, isLast };
}

export default useSteps;