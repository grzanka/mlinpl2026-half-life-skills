cmake_minimum_required(VERSION 3.16)
project(water_phantom CXX)

find_package(Geant4 REQUIRED)

add_executable(water_phantom water_phantom.cc)
target_link_libraries(water_phantom ${Geant4_LIBRARIES})
