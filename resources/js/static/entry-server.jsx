import { renderToString } from 'react-dom/server';
import Profile from '../Pages/Profile';

/**
 * Rend la page en HTML au moment du build.
 *
 * Les effets (horloge, révélations, bascule de thème) ne tournent pas ici :
 * ils reprennent la main à l'hydratation, côté navigateur. Le HTML livré
 * contient donc tout le contenu, ce qui est exactement ce qu'un robot
 * d'indexation doit trouver sans exécuter de JavaScript.
 */
export function render(props) {
    return renderToString(<Profile {...props} />);
}
