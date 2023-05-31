export const APP_ROUTES = {
    private: {
        servicos: {
            certificar_ciclo: '/servicos/certificar-ciclo',
            certificar_prazo: '/servicos/certificar-prazo',
            certificar_transito: '/servicos/certificar-transito',
            certitidao_honorarios_oab: {
              index: '/servicos/certitidao-honorarios-oab',
              imprimir: '/servicos/certitidao-honorarios-oab/imprimir',
            }
        }
        
    },
    public: {
        home: '/',
        login: '/login',
        cadastro: '/cadastro',
        
        tips: {
            codigo_oab: '/tips/codigo-oab',
            zonas: '/tips/zonas',
            entes_municipais: '/tips/entes-municipais',
            entes_estaduais: '/tips/entes-estaduais',
        }
    },
};


export const menuItems = [
    {
      
      title: 'Inicio',
      path: APP_ROUTES.public.home,
    },
    {
      title: 'Certificador',
      dropdown: [
        {
          title: 'Certidão de Honorários OAB',
          path: APP_ROUTES.private.servicos.certitidao_honorarios_oab.index,
        },
        {
          title: 'Certificar ciclo',
          path: APP_ROUTES.private.servicos.certificar_ciclo,
        },
        { 
          title: 'Certificar prazo',
          path: APP_ROUTES.private.servicos.certificar_prazo,
        },
        { 
          title: 'Certificar trânsito',
          path: APP_ROUTES.private.servicos.certificar_transito,
        },
      ],
    },
    {
        title: 'Dicas',
        dropdown: [
          {
            title: 'Código defensoria',
            path: APP_ROUTES.public.tips.codigo_oab,
          },
          {
            
            title: 'Zonas',
            path: APP_ROUTES.public.tips.zonas,
          },
            {
                title: 'Entes municipais',
                path: APP_ROUTES.public.tips.entes_municipais,
            },
            {
                title: 'Entes estaduais',
                path: APP_ROUTES.public.tips.entes_estaduais,
            },
        ],
      },
  ];

export function checkIsPublicRoute(rota: string): boolean {

    function isRotaPublicaRec(routes: any): boolean {
      return Object.values(routes).some((route) => {
        if (typeof route === 'object') {
          return isRotaPublicaRec(route);
        }
        return route === rota;
      });
    }
  
    return isRotaPublicaRec(APP_ROUTES.public);
  }