import fs from 'fs/promises';
import path from 'path';
import prisma from './prisma';

export async function loadBlueprints() {
  const blueprintsDir = path.join(process.cwd(), 'blueprints');
  console.log('Searching for blueprints in:', blueprintsDir);
  
  try {
    const entries = await fs.readdir(blueprintsDir, { withFileTypes: true });
    console.log('Found entries:', entries.map(e => e.name));

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const configPath = path.join(blueprintsDir, entry.name, 'blueprint-config.js');
        console.log('Attempting to load config from:', configPath);
        
        try {
          const configContent = await fs.readFile(configPath, 'utf-8');
          console.log('Config content:', configContent);
          
          const match = configContent.match(/module\.exports\s*=\s*({[\s\S]*});?\s*$/);
          if (match) {
            const configObject = JSON.parse(JSON.stringify(eval('(' + match[1] + ')')));
            console.log('Parsed config:', configObject);

            const upsertResult = await prisma.blueprint.upsert({
              where: { name: entry.name },
              update: { config: JSON.stringify(configObject) },
              create: { name: entry.name, config: JSON.stringify(configObject) },
            });
            console.log(`Upsert result for ${entry.name}:`, upsertResult);
          } else {
            console.error(`Invalid config format for ${entry.name}`);
          }
        } catch (error) {
          console.error(`Error loading blueprint ${entry.name}:`, error);
        }
      }
    }

    const loadedBlueprints = await prisma.blueprint.findMany();
    console.log('Blueprints in database after loading:', loadedBlueprints);
    return loadedBlueprints;
  } catch (error) {
    console.error('Error reading blueprints directory:', error);
    return [];
  }
}