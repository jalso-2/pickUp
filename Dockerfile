FROM node:7
RUN mkdir /pickUp
ADD . /pickUp
WORKDIR /pickUp
RUN npm i -g grunt-cli
RUN npm i
RUN bower i
EXPOSE 7000
CMD ["grunt", "bypass"]
