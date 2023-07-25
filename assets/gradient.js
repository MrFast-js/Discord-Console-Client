const gradient = require('../libs/gradient')

module.exports = {
    pastel: gradient.pastel.fullConsole,
    vice: gradient.vice.fullConsole,
    cristal: gradient.cristal.fullConsole,
    teen: gradient.teen.fullConsole,
    mind: gradient.mind.fullConsole,
    morning: gradient.morning.fullConsole,
    passion: gradient.passion.fullConsole,
    fruit: gradient.fruit.fullConsole,
    insta: gradient.instagram.fullConsole,
    instagram: gradient.instagram.fullConsole,
    atlas: gradient.atlas.fullConsole,
    retro: gradient.retro.fullConsole,
    summer: gradient.summer.fullConsole,
    rainbow: gradient.rainbow.fullConsole,
    steel: gradient([
        { color: '#444444', pos: 0 },
        { color: '#FFFFFF', pos: 0.15 },
        { color: '#BBBBBB', pos: 0.2 },
        { color: '#444444', pos: 1 }
    ]).fullConsole,
    dreamy: gradient([
        { color: '#34eb64' },
        { color: '#3477eb' },
        { color: '#b134eb' }
    ]).fullConsole,
    grape: gradient([
        { color: '#cf6eff' },
        { color: '#ab05fc' }
    ]).fullConsole,
    firey: gradient([
        { color: '#eb8034' },
        { color: '#f5a020' },
        { color: '#e34829' },
        { color: '#fcdc49' }
    ]).fullConsole,
    water: gradient([
        { color: '#49dcfc' },
        { color: '#49fccd' },
        { color: '#49bbfc' },
        { color: '#497cfc' },
        { color: '#49c7fc' },
        { color: '#4967fc' }
    ]).fullConsole
}
