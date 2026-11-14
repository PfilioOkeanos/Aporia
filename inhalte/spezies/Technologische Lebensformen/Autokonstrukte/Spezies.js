import { applyAporiaRoutes } from "../../../../Menüs/adapter/aporia-routes.js";
import "../../../../Menüs/TopBar/Top_bar.js";
import "../../../../Menüs/Side_bar/side_bar.js";

applyAporiaRoutes(document);

import { arrangeKnowledgeCards } from "../../_gemeinsam/wissenslayout.js";
arrangeKnowledgeCards();
