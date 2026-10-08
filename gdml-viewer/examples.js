// Example GDML files for the "Example" buttons.

// The geometry of the tutorial's shielding example (docs/08-shielding-demo.md), as written by the
// geant4-ai agent: 1 mm and 10 mm aluminium side by side, a 1 mm water detector behind each.
export const SHIELDING = `<?xml version="1.0" ?>
<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">
	<define/>
	<materials/>
	<solids>
		<box name="world_s" x="20.0" y="20.0" z="20.0" lunit="cm"/>
		<box name="shield_left_s" x="5.0" y="10.0" z="0.1" lunit="cm"/>
		<box name="shield_right_s" x="5.0" y="10.0" z="1.0" lunit="cm"/>
		<box name="det_left_s" x="5.0" y="10.0" z="0.1" lunit="cm"/>
		<box name="det_right_s" x="5.0" y="10.0" z="0.1" lunit="cm"/>
	</solids>
	<structure>
		<volume name="shield_left_l">
			<materialref ref="G4_Al"/>
			<solidref ref="shield_left_s"/>
		</volume>
		<volume name="shield_right_l">
			<materialref ref="G4_Al"/>
			<solidref ref="shield_right_s"/>
		</volume>
		<volume name="det_left_l">
			<materialref ref="G4_WATER"/>
			<solidref ref="det_left_s"/>
		</volume>
		<volume name="det_right_l">
			<materialref ref="G4_WATER"/>
			<solidref ref="det_right_s"/>
		</volume>
		<volume name="World">
			<materialref ref="G4_AIR"/>
			<solidref ref="world_s"/>
			<physvol name="shield_left_pv">
				<volumeref ref="shield_left_l"/>
				<position name="shield_left_pv_pos" x="-25" y="0" z="0.5" unit="mm"/>
			</physvol>
			<physvol name="shield_right_pv">
				<volumeref ref="shield_right_l"/>
				<position name="shield_right_pv_pos" x="25" y="0" z="5" unit="mm"/>
			</physvol>
			<physvol name="det_left_pv">
				<volumeref ref="det_left_l"/>
				<position name="det_left_pv_pos" x="-25" y="0" z="20.5" unit="mm"/>
			</physvol>
			<physvol name="det_right_pv">
				<volumeref ref="det_right_l"/>
				<position name="det_right_pv_pos" x="25" y="0" z="20.5" unit="mm"/>
			</physvol>
		</volume>
	</structure>
	<setup name="Default" version="1.0">
		<world ref="World"/>
	</setup>
</gdml>
`;

// A tour of the supported solids, defines, nesting and a rotation.
export const SHAPES = `<?xml version="1.0" encoding="UTF-8"?>
<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://service-spi.web.cern.ch/service-spi/app/releases/GDML/schema/gdml.xsd">
  <define>
    <constant name="pitch" value="120"/>
    <position name="tube_pos" x="-pitch" y="0" z="0" unit="mm"/>
    <rotation name="tilt" z="30" unit="deg"/>
  </define>
  <materials/>
  <solids>
    <box name="world_s" x="600" y="300" z="300" lunit="mm"/>
    <tube name="tube_s" rmin="20" rmax="40" z="80" deltaphi="270" aunit="deg" lunit="mm"/>
    <cone name="cone_s" rmin1="0" rmax1="45" rmin2="0" rmax2="10" z="90" deltaphi="360" aunit="deg" lunit="mm"/>
    <sphere name="shell_s" rmin="30" rmax="45" deltaphi="360" deltatheta="90" aunit="deg" lunit="mm"/>
    <box name="bar_s" x="100" y="10" z="10" lunit="mm"/>
    <polycone name="pcon_s" startphi="0" deltaphi="360" aunit="deg" lunit="mm">
      <zplane rmin="0" rmax="30" z="-40"/>
      <zplane rmin="0" rmax="15" z="0"/>
      <zplane rmin="0" rmax="35" z="40"/>
    </polycone>
    <box name="frame_outer_s" x="80" y="80" z="20" lunit="mm"/>
    <tube name="frame_hole_s" rmax="25" z="30" deltaphi="360" aunit="deg" lunit="mm"/>
    <subtraction name="frame_s">
      <first ref="frame_outer_s"/>
      <second ref="frame_hole_s"/>
    </subtraction>
    <box name="crate_s" x="110" y="110" z="110" lunit="mm"/>
    <box name="cube_s" x="30" y="30" z="30" lunit="mm"/>
  </solids>
  <structure>
    <volume name="tube_l"><materialref ref="G4_Al"/><solidref ref="tube_s"/></volume>
    <volume name="cone_l"><materialref ref="G4_Cu"/><solidref ref="cone_s"/></volume>
    <volume name="shell_l"><materialref ref="G4_WATER"/><solidref ref="shell_s"/></volume>
    <volume name="bar_l"><materialref ref="G4_Pb"/><solidref ref="bar_s"/></volume>
    <volume name="pcon_l"><materialref ref="G4_Si"/><solidref ref="pcon_s"/></volume>
    <volume name="frame_l"><materialref ref="G4_STAINLESS-STEEL"/><solidref ref="frame_s"/></volume>
    <volume name="cube_l"><materialref ref="G4_WATER"/><solidref ref="cube_s"/></volume>
    <volume name="crate_l">
      <materialref ref="G4_AIR"/><solidref ref="crate_s"/>
      <physvol name="cube_in_crate"><volumeref ref="cube_l"/><position name="c" x="30" y="30" z="0" unit="mm"/></physvol>
    </volume>
    <volume name="World">
      <materialref ref="G4_AIR"/>
      <solidref ref="world_s"/>
      <physvol name="tube_pv"><volumeref ref="tube_l"/><positionref ref="tube_pos"/></physvol>
      <physvol name="cone_pv"><volumeref ref="cone_l"/><position name="p1" x="0" y="0" z="0" unit="mm"/></physvol>
      <physvol name="shell_pv"><volumeref ref="shell_l"/><position name="p2" x="pitch" y="0" z="0" unit="mm"/></physvol>
      <physvol name="bar_pv"><volumeref ref="bar_l"/><position name="p3" x="0" y="0" z="-100" unit="mm"/><rotationref ref="tilt"/></physvol>
      <physvol name="pcon_pv"><volumeref ref="pcon_l"/><position name="p4" x="-2*pitch" y="0" z="0" unit="mm"/></physvol>
      <physvol name="frame_pv"><volumeref ref="frame_l"/><position name="p5" x="2*pitch" y="0" z="0" unit="mm"/></physvol>
      <physvol name="crate_pv"><volumeref ref="crate_l"/><position name="p6" x="0" y="0" z="100" unit="mm"/></physvol>
    </volume>
  </structure>
  <setup name="Default" version="1.0">
    <world ref="World"/>
  </setup>
</gdml>
`;
