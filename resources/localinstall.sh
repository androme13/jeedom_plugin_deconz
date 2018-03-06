#config file https://github.com/dresden-elektronik/deconz-rest-plugin/issues/295



# test
# Important: enable_uart=1 should be set in /boot/config
# grep -c console=serial0 cmdline.txt
# sudo sed -i 's/$/ enable_uart=1/' /boot/cmdline.txt

# Important: /boot/cmdline must not contain console=serial0


# recherche de serial0 et suppression
# regex : /console=serial0,*[0-9]*\s*/g
# sed -i 's/console=serial0,*[0-9]*\s*//' /boot/cmdline.txt



# systemctl enable deconz
# service deconz start





#!/bin/bash
touch /tmp/deconz_local_dep
echo "Début de l'installation de DeCONZ en local"
echo 0 > /tmp/deconz_local_dep

apt-get update
cd /tmp



wget http://www.dresden-elektronik.de/rpi/deconz/beta/deconz-2.05.08-qt5.deb

dpkg -i deconz-2.05.08-qt5.deb

apt install -f



#
service deconz stop
service deconz-update stop
service deconz-wifi stop





