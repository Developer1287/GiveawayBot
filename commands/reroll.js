exports.run = async (client, message, args) => {
  const Discord = require("discord.js")
  // If the member doesn't have enough permissions
  if (
    !message.member.hasPermission("MANAGE_MESSAGES") &&
    !message.member.roles.cache.some(r => r.name === "Giveaways")
  ) {
    return message.channel.send(
      ":x: You need to have the manage messages permissions to reroll giveaways."
    );
  }

  if (args[0] && !args[1]) {
    message.channel.messages
      .fetch(args[0])
      .then(rerollmsg => {
        reroll();
        async function reroll() {
          let invalidmsg = new Discord.MessageEmbed()
            .setTitle("Reroll")
            .setColor("RANDOM")
            .setDescription(`This provided message is not a giveaway message.`);
          if (rerollmsg.author.id == client.user.id) {
            if (rerollmsg.embeds.length !== 0) {
              if (rerollmsg.embeds[0].title.startsWith("Giveaway!")) {
                if (rerollmsg.embeds[0].description == "Giveaway is over.") {
                  let users = [];
                  let react = (await rerollmsg.reactions.cache.get("🎉").users)
                    ? (await rerollmsg.reactions.cache.get("🎉").users.fetch())
                      .array()
                      .filter(user => user.id !== client.user.id)
                    : [];
                  let requirements =
                    rerollmsg.embeds[0].fields[1].value == "None!"
                      ? []
                      : rerollmsg.embeds[0].fields[1].value.split("\n");
                  let winners = parseFloat(
                    rerollmsg.embeds[0].footer.text.slice(
                      "There could have been up to ".length
                    )
                  );
                  for (var i = 0, len = winners; i < len; i++) {
                    let random = Math.floor(Math.random() * react.length);
                    if (react.length == 0) {
                      i == winners;
                    } else {
                      let id = react[random].id;
                      if (users.includes(id)) {
                        i--;
                      } else {
                        let pass = true;
                        if (!message.guild.members.cache.get(id)) pass = false;
                        let checkserver = requirements.filter(t =>
                          t.startsWith("Join")
                        );
                        if (checkserver.length !== 0) {
                          let serverid = checkserver[0].slice(0, -1).slice(-18);
                          let server = await client.guilds.cache.get(serverid);
                          if (server) {
                            if (
                              server.members.cache
                                .filter(u => u.id == id)
                                .array().length == 0
                            ) {
                              pass = false;
                            }
                          }
                        }
                        /*
                                                    if (requirements.filter(t => t.startsWith("Send")).length !== 0) {
                                                        let messagecount = parseFloat(requirements.filter(t => t.startsWith("Send")).slice("Send".length));
                                                        if (msgdatabase[thing].length == 0) {
                                                            pass = false
                                                        } else {
                                                            for (var i = 0, len = msgdatabase[thing].length; i < len; i++) {
                                                                if (msgdatabase[thing][i].id == id) {
                                                                    let test = msgdatabase[thing][i];
                                                                    if (test.id == id) {
                                                                        if (test.count < messagecount) {
                                                                            pass = false
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                    */
                        if (pass == true) {
                          users.push("<@" + id + ">");
                        } else {
                          i--;
                        }
                        delete react[random];
                        react = react.filter(function(el) {
                          return el != null;
                        });
                      }
                    }
                  }
                  message.delete();
                  await rerollmsg.edit(
                    new Discord.MessageEmbed()
                      .setTitle(rerollmsg.embeds[0].title)
                      .setColor("RANDOM")
                      .setDescription(rerollmsg.embeds[0].description)
                      .addField(
                        "Winners",
                        users.length !== 0 ? users.join("\n") : "No winners."
                      )
                      .addField(
                        "Requirements",
                        rerollmsg.embeds[0].fields[1].value
                      )
                      .setFooter(rerollmsg.embeds[0].footer.text)
                  );
                  message.channel.send(
                    ":tada: **The giveaway has ended.** Our winners are:" +
                    (users.length == 0
                      ? " No winners."
                      : "\n- " + users.join("\n- "))
                  );
                } else {
                  message.channel.send(
                    new Discord.MessageEmbed()
                      .setTitle("Reroll")
                      .setColor("RANDOM")
                      .setDescription(`The giveaway has not ended yet.`)
                  );
                }
              } else {
                message.channel.send(invalidmsg);
              }
            } else {
              message.channel.send(invalidmsg);
            }
          } else {
            message.channel.send(
              new Discord.MessageEmbed()
                .setTitle("Reroll")
                .setColor("RANDOM")
                .setDescription(`Message author is not the bot.`)
            );
          }
        }
      })
      .catch(err => {
        message.channel.send(
          new Discord.MessageEmbed()
            .setTitle("Reroll")
            .setColor("RANDOM")
            .setDescription(`Could not find the message.`)
        );
      });
  } else {
    message.channel.send(
      new Discord.MessageEmbed()
        .setTitle("Reroll")
        .setColor("RANDOM")
        .setDescription(
          `In order to use this command, you must run the command \`${settings.bot.prefix}reroll <message id>\`.\nMake sure the message is in this channel.\n\nAny message and role checks will not work on reroll.`
        )
    );
  }
};
