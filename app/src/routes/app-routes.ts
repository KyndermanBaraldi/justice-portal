export const APP_ROUTES = {
    private: {
        servicos: {
            certificar_prazo: '/servicos/certificar-prazo',
            certitidao_honorarios_oab: '/servicos/certitidao-honorarios-oab',
        }
        
    },
    public: {
        home: '/',
        login: '/login',
        cadastro: '/cadastro',
        sobre: '/sobre',
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
          title: 'Certificar prazo',
          path: APP_ROUTES.private.servicos.certificar_prazo,
        },
        {
          title: 'Certidão de Honorários OAB',
          path: APP_ROUTES.private.servicos.certitidao_honorarios_oab,
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
    {
      title: 'Sobre',
      path: APP_ROUTES.public.sobre,
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