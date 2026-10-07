// Minimal Geant4 application: a block of water in air.
// The beam, the scoring and the number of events are all set from a macro,
// so you never need to touch this file to run the tutorial.
//
// Usage: water_phantom run.mac
// Physics list: QBBC by default, override with e.g. PHYSLIST=QGSP_BIC_EMZ

#include "G4Box.hh"
#include "G4GeneralParticleSource.hh"
#include "G4LogicalVolume.hh"
#include "G4NistManager.hh"
#include "G4PVPlacement.hh"
#include "G4PhysListFactory.hh"
#include "G4RunManagerFactory.hh"
#include "G4ScoringManager.hh"
#include "G4SystemOfUnits.hh"
#include "G4UImanager.hh"
#include "G4VUserActionInitialization.hh"
#include "G4VUserDetectorConstruction.hh"
#include "G4VUserPrimaryGeneratorAction.hh"

#include <cstdlib>

// Geometry: 1 m air cube with a 20 x 20 x 40 cm water phantom, front face at z = 0.
class Geometry : public G4VUserDetectorConstruction
{
  public:
    G4VPhysicalVolume* Construct() override
    {
      auto nist = G4NistManager::Instance();

      auto worldSolid = new G4Box("World", 0.5 * m, 0.5 * m, 0.5 * m);
      auto worldLV =
        new G4LogicalVolume(worldSolid, nist->FindOrBuildMaterial("G4_AIR"), "World");
      auto worldPV =
        new G4PVPlacement(nullptr, G4ThreeVector(), worldLV, "World", nullptr, false, 0, true);

      auto phantomSolid = new G4Box("Phantom", 10 * cm, 10 * cm, 20 * cm);  // half-lengths
      auto phantomLV =
        new G4LogicalVolume(phantomSolid, nist->FindOrBuildMaterial("G4_WATER"), "Phantom");
      new G4PVPlacement(nullptr, G4ThreeVector(0, 0, 20 * cm), phantomLV, "Phantom", worldLV,
                        false, 0, true);

      return worldPV;
    }
};

// Beam: General Particle Source, configured with /gps/ commands in the macro.
class Beam : public G4VUserPrimaryGeneratorAction
{
  public:
    void GeneratePrimaries(G4Event* event) override { fSource.GeneratePrimaryVertex(event); }

  private:
    G4GeneralParticleSource fSource;
};

class Actions : public G4VUserActionInitialization
{
  public:
    void Build() const override { SetUserAction(new Beam); }
};

int main(int argc, char** argv)
{
  if (argc != 2) {
    G4cerr << "Usage: " << argv[0] << " <macro.mac>" << G4endl;
    return 1;
  }

  auto runManager = G4RunManagerFactory::CreateRunManager();

  // Enables the /score/ commands (command-based scoring meshes).
  G4ScoringManager::GetScoringManager();

  const char* physListEnv = std::getenv("PHYSLIST");
  G4PhysListFactory physListFactory;
  auto physics = physListFactory.GetReferencePhysList(physListEnv ? physListEnv : "QBBC");
  if (physics == nullptr) {
    return 1;
  }

  runManager->SetUserInitialization(new Geometry);
  runManager->SetUserInitialization(physics);
  runManager->SetUserInitialization(new Actions);

  G4UImanager::GetUIpointer()->ApplyCommand(G4String("/control/execute ") + argv[1]);

  delete runManager;
  return 0;
}
