import { Request, Response } from "express";
import DesignProject from "../schemas/designProject";
import CustomShoeTemporary from "../schemas/customShoeTemporary";

const saveDesignProjectHandler = [
    async (req: Request, res: Response) => {
        const { customContextData, userId } = req.body;
      
        try {
          if (!userId) {
            return res.status(400).json({ error: "User ID is missing" });
          }
      
          const existingProject = await DesignProject.findOne({ userId });
      
          // Tworzymy nowy projekt na podstawie danych z żądania
          const newProject = {
            designName: customContextData.designName,
            selectedColors: customContextData.selectedColors,
            selectedColorsText: customContextData.selectedColorsText,
            selectedPatches: customContextData.selectedPatches,
            swooshVisibility: customContextData.swooshVisibility,
            sideText: customContextData.sideText,
          };
      
          // Wyszukujemy dokument `DesignProject` dla danego użytkownika
      
          if (existingProject) {
            const isProjectNameTaken = existingProject.projects.some(
              (project) => project.designName === newProject.designName
            );
      
            if (isProjectNameTaken) {
              return res.status(200).json({
                taken: "Project with this name already exists for the user",
              });
            }
      
            // Dodaj nowy projekt do tablicy projektów użytkownika
            existingProject.projects.push(newProject);
            await existingProject.save();
          } else {
            // Jeśli użytkownik nie ma jeszcze żadnych projektów, utwórz nowy dokument `DesignProject`
            const newDesignProject = new DesignProject({
              userId,
              projects: [newProject],
            });
            await newDesignProject.save();
          }
      
          await CustomShoeTemporary.findOneAndRemove({ userId });
      
          return res.status(200).json({ message: "Project saved successfully" });
        } catch (error) {
          console.error("Error while saving project", error);
          return res
            .status(500)
            .json({ error: "An error occurred while saving the project" });
        }
      }
];

export default saveDesignProjectHandler