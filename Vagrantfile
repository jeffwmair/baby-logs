# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network :forwarded_port, guest: 22, host: 2223, id: 'ssh'
  # apache at 80
  config.vm.network "forwarded_port", guest: 80, host: 8070
  # flask app at 8080
  config.vm.network "forwarded_port", guest: 8080, host: 8071
  # mysql at 3306
  config.vm.network "forwarded_port", guest: 3306, host: 3304
  config.vm.provision "shell", path: "vagrant-scripts/bootstrap.sh"
  config.vm.provision "shell", path: "scripts/install.sh", privileged: false
end
