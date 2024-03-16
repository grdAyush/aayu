const { Message, EmbedBuilder, version, AttachmentBuilder } = require('discord.js');
const ExtendedClient = require('../../../class/ExtendedClient');
const DB = require('../../../schemas/clientsts');
const { execute } = require("../../../events/Client/ready");
const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const moment = require("moment");
require("../../../events/Client/ready");
require("moment-duration-format");
const { mem, cpu } = require("node-os-utils");
const os = require("node:os")
const { stripIndent } = require("common-tags");
const GuildSchema = require('../../../handlers/xata').getXataClient().db.GuildSchema;
const config = require('../../../config');

module.exports = {
    structure: {
        name: 'stats',
        description: 'see the stats of the bot',
       aliases: ["stat", "sts"],
        permissions: null,
  cooldown: 7000
    },
    /**
     * @param {ExtendedClient} client 
     * @param {Message} message 
     * @param {[String]} args 
     */
    run: async (client, message) => {

    const msg = await message.channel.send({ content: "Wait For Some Time Fetching Data..."})
    const Schema = await GuildSchema.read(`${message.guildId}`);
    if (!Schema || !Schema.prefix) { prefix = config.handler.prefix } else prefix = Schema.prefix



        const docs = await DB.findOne({
            Client: true
        });

        const mem0 = docs.Memory[0];
        const mem1 = docs.Memory[1];
        const mem2 = docs.Memory[2];
        const mem3 = docs.Memory[3];
        const mem4 = docs.Memory[4];
        const mem5 = docs.Memory[5];
        const mem6 = docs.Memory[6];
        const mem7 = docs.Memory[7];
        const mem8 = docs.Memory[8];
        const mem9 = docs.Memory[9];
        const mem10 = docs.Memory[10];
        const mem11 = docs.Memory[11];
        const mem12 = docs.Memory[12];


        
        const colors = {
            green: {
                default: "rgba(92, 221, 139, 1)",
                half: "rgba(92, 221, 139, 0.5)",
                quarter: "rgba(92, 221, 139, 0.25)",
                low: "rgba(92, 221, 139, 0.1)",
                zero: "rgba(92, 221, 139, 0)"
            },
            pink: {
                default: "rgba(255, 105, 180, 1)",
                half: "rgba(255, 105, 180, 0.5)",
                quarter: "rgba(255, 105, 180, 0.25)",
                low: "rgba(255, 105, 180, 0.1)",
                zero: "rgba(255, 105, 180, 0)"
            },
            purple: {
                default: "rgba(149, 76, 233, 1)",
                half: "rgba(149, 76, 233, 0.5)",
                quarter: "rgba(149, 76, 233, 0.25)",
                low: "rgba(149, 76, 233, 0.1)",
                zero: "rgba(149, 76, 233, 0)"
            },
            indigo: {
                default: "rgba(80, 102, 120, 1)",
                quarter: "rgba(80, 102, 120, 0.25)"
            }
        };

        const memData = [
            mem0,
            mem1,
            mem2,
            mem3,
            mem4,
            mem5,
            mem6,
            mem7,
            mem8,
            mem9,
            mem10,
            mem11,
            mem12,
        ];

      
        const labels = [
            '60',
            '55',
            '50',
            '45',
            '40',
            '35',
            '30',
            '25',
            '20',
            '15',
            '10',
            '5',
        ];

     
        const width = 1500;
        const height = 720;

        const plugin = {
            id: 'mainBg',
            beforeDraw: (chart) => {
                const ctx = chart.canvas.getContext('2d');
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = '#192027';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        }

       
        const chartCallback = () => {}
        const canvas = new ChartJSNodeCanvas({
            width: width,
            height: height,
            plugins: {
                modern: [require('chartjs-plugin-gradient')],
            },
            chartCallback: chartCallback
        })

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'RAM Usage',
                    fill: true,
                    backgroundColor: colors.pink.low, //TODO: Change to a gradient
                    pointBackgroundColor: colors.pink.default,
                    borderColor: colors.pink.default,
                    data: memData,
                    lineTension: 0.4,
                    borderWidth: 2,
                    pointRadius: 3
                },
            ],
        }

        const chartConfig = {
            type: "line",
            data: chartData,
            options: {
                layout: {
                    padding: 10
                },
                responsive: false,
                plugins: {
                    legend: {
                        display: true,
                    }
                },
                scales: {
                    xAxes: {
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            padding: 10,
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0
                        }
                    },
                    yAxes: {
                        scaleLabel: {
                            display: true,
                            labelString: "Usage",
                            padding: 10
                        },
                        gridLines: {
                            display: true,
                            color: colors.indigo.quarter
                        },
                        ticks: {
                            beginAtZero: false,
                            max: 63,
                            min: 57,
                            padding: 10
                        }
                    }
                }
            },
            plugins: [plugin]
        }

        const image = await canvas.renderToBuffer(chartConfig);
        const attachment = new AttachmentBuilder(image, {name: 'chart.png'});
       
        if (!docs || docs.Memory.length < 5) {
            return msg.edit({
                content: "",
                embeds: [
                    new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription('Please Wait For The Information To Be Collected!\n Use This Command After 10 Seconds 💕')
                ]
            });
        }



        const d = moment.duration(client.uptime);
    const days = d.days() == 1 ? `${d.days()} day` : `${d.days()} days`;
    const hours = d.hours() == 1 ? `${d.hours()} hour` : `${d.hours()} hours`;
    const clientStats = stripIndent`
          Servers   :: ${client.guilds.cache.size}
          Users     :: ${client.users.cache.size}
          Channels  :: ${client.channels.cache.size}
          WS Ping   :: ${Math.round(client.ws.ping)}ms
          Uptime    :: ${days} and ${hours}
          Prefix    :: ${prefix}
          Node      :: ${process.version}
          Library   :: discord.js@${version}
       `;
    const { totalMemMb, usedMemMb } = await mem.info();
    const serverStats = stripIndent`
          OS        :: ${os.platform()} ${os.arch()}
          Cores     :: ${cpu.count()}
          CPU Usage :: ${await cpu.usage()} %
          RAM       :: ${totalMemMb} MB
          RAM Usage :: ${usedMemMb} MB
        `;

    const replyEmbed = new EmbedBuilder()

      .setTitle("Bot's Statistics")
      .addFields({
        name: "Memory Usage",
        value: `\`\`\`asciidoc\n${clientStats}\`\`\``
      },
      {
        name: "Memory Usage",
        value: `\`\`\`asciidoc\n${serverStats}\`\`\``
      })
      .setTimestamp()
      .setImage('attachment://chart.png')
      .setColor(client.color);


    
await msg.edit({ embeds: [replyEmbed], files: [attachment], content: ""})

    
          },
        }
          
          

          

