import { Request, Response } from "express";
import DesignProject from "../schemas/designProject";

const saveSpecificProjectHandler = [
    async (req: Request, res: Response) => {
        const userId = req.body.userId;
        const projectName = req.body.projectName;
        const customContextData = req.body.customContextData;
      
        try {
          if (!userId || !projectName || !customContextData) {
            return res.status(400).json({ error: "User ID, Project Name, or data is missing" });
          }
      
          const userProjects = await DesignProject.findOne({ userId: userId });
      
          if (!userProjects) {
            return res.status(404).json({ error: "User not found or has no projects" });
          }
      
          const specificProject = userProjects.projects.find(
            (project) => project.designName === projectName
          );
      
          if (!specificProject) {
            console.error('Projekt o określonej nazwie nie został znaleziony');
            return res.status(404).json({ error: 'Projekt o określonej nazwie nie został znaleziony' });
          }
      
          // Aktualizuj dane projektu na podstawie customContextData
          specificProject.selectedColors = customContextData.selectedColors;
          specificProject.selectedColorsText = customContextData.selectedColorsText;
          specificProject.selectedPatches = customContextData.selectedPatches;
          specificProject.swooshVisibility = customContextData.swooshVisibility;
          specificProject.sideText = customContextData.sideText;
      
          await userProjects.save();
      
          return res.status(200).json({ message: "Project saved successfully" });
      
        } catch (error) {
          console.error("Error while saving project", error);
          return res
            .status(500)
            .json({ error: "An error occurred while saving the project" });
        }
    }
];

export default saveSpecificProjectHandler