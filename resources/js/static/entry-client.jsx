import { hydrateRoot } from 'react-dom/client';
import Profile from '../Pages/Profile';
import '../../css/app.css';

/**
 * Reprend le HTML pré-rendu et le rend interactif.
 *
 * Les props sont lues dans le script JSON écrit par le pré-rendu : le
 * navigateur travaille exactement sur les mêmes données que le build, sinon
 * React signalerait une divergence d'hydratation.
 */
const node = document.getElementById('profile-data');
const props = JSON.parse(node.textContent);

hydrateRoot(document.getElementById('app'), <Profile {...props} />);
