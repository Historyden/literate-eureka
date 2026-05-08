{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs-18_x
    pkgs.python311
    pkgs.python311Packages.fastapi
    pkgs.python311Packages.uvicorn
    pkgs.postgresql
  ];

  shellHook = ''
    echo "Socratic-DAG Development Environment"
    echo "Node.js $(node --version)"
    echo "Python $(python --version)"
  '';
}
