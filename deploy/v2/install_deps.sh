#!/bin/bash
set -e

# Directory to install tools (simulating 'venv' isolation)
TOOLS_DIR="$(pwd)/_tools"
mkdir -p "$TOOLS_DIR"

echo "🛠️  Setting up local tools in $TOOLS_DIR..."

# Detect OS and Arch
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
if [ "$ARCH" == "x86_64" ]; then ARCH="amd64"; fi
# (Add more arch mappings if needed, but x86_64 is standard for WSL)

# 1. Install Helm (Manual Download to avoid script issues)
if [ ! -f "$TOOLS_DIR/helm" ]; then
    echo "⬇️  Downloading Helm (v3.13.2)..."
    HELM_URL="https://get.helm.sh/helm-v3.13.2-${OS}-${ARCH}.tar.gz"
    curl -fsSL -o helm.tar.gz "$HELM_URL"
    
    echo "📦 Extracting Helm..."
    tar -zxvf helm.tar.gz
    # The tarball extracts to directory like linux-amd64/helm
    mv "${OS}-${ARCH}/helm" "$TOOLS_DIR/helm"
    
    # Cleanup
    rm helm.tar.gz
    rm -rf "${OS}-${ARCH}"
    
    chmod +x "$TOOLS_DIR/helm"
    echo "✅ Helm installed to $TOOLS_DIR/helm"
else
    echo "✅ Helm already exists."
fi

# 2. Install Kubectl
if [ ! -f "$TOOLS_DIR/kubectl" ]; then
    echo "⬇️  Downloading Kubectl..."
    # Get latest stable version string
    STABLE_VERSION=$(curl -L -s https://dl.k8s.io/release/stable.txt)
    KUBECTL_URL="https://dl.k8s.io/release/${STABLE_VERSION}/bin/${OS}/${ARCH}/kubectl"
    
    curl -LO "$KUBECTL_URL"
    chmod +x kubectl
    mv kubectl "$TOOLS_DIR/"
    echo "✅ Kubectl installed to $TOOLS_DIR/kubectl"
else
    echo "✅ Kubectl already exists."
fi

# 3. Install Minikube
if [ ! -f "$TOOLS_DIR/minikube" ]; then
    echo "⬇️  Downloading Minikube..."
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    chmod +x minikube-linux-amd64
    mv minikube-linux-amd64 "$TOOLS_DIR/minikube"
    echo "✅ Minikube installed to $TOOLS_DIR/minikube"
else
    echo "✅ Minikube already exists."
fi

echo ""
echo "🎉 Installation Complete!"
