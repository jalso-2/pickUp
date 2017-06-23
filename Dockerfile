FROM dragonmantank/nodejs-grunt-bower
RUN mkdir /pickUp
ADD . /pickUp
WORKDIR /pickUp
RUN npm i
RUN bower i
EXPOSE 7000
CMD ["grunt", "bypass"]
