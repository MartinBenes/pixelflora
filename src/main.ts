import './styles/main.css';
import './styles/layout.css';
import './styles/controls.css';
import './styles/canvas.css';
import './styles/notifications.css';
import { PlantGeneratorApp } from './ui/app';
import { installErrorMonitor } from './ui/error-monitor';

installErrorMonitor();
const app = new PlantGeneratorApp();
app.init();
