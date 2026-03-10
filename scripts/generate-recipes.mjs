/**
 * generate-recipes.mjs
 * Generates quality Danish recipes using Claude API
 * Usage: ANTHROPIC_API_KEY=sk-... node scripts/generate-recipes.mjs
 */

import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const PUBLIC = path.join(ROOT, 'public')
const RECIPES_DIR = path.join(PUBLIC, 'recipes')

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// ─── Recipe specs ────────────────────────────────────────────────────────────
// diet: 'glutenfri' | 'laktosefri' | 'begge'
// dishType: 'aftensmad' | 'bagværk' | 'dessert'
// protein: 'chicken' | 'meat' | 'fish' | 'vegetarian' | null
// imageKeywords: Unsplash search terms

const SPECS = [
  // ── Aftensmad / glutenfri ─────────────────────────────────────────────────
  { title: 'Frikadeller med kartoffelmos og persillesovs',    diet: 'glutenfri', dishType: 'aftensmad', protein: 'meat',       cuisine: 'danish',        imageKeywords: 'meatballs mashed potatoes danish food' },
  { title: 'Stegt flæsk med persillesovs og bagte kartofler', diet: 'glutenfri', dishType: 'aftensmad', protein: 'meat',       cuisine: 'danish',        imageKeywords: 'crispy pork danish food dinner' },
  { title: 'Kylling i karry med basmatiris',                  diet: 'glutenfri', dishType: 'aftensmad', protein: 'chicken',    cuisine: 'indian',        imageKeywords: 'chicken curry rice indian food' },
  { title: 'Laksebøf med sprødstegte kartofler og dild',      diet: 'glutenfri', dishType: 'aftensmad', protein: 'fish',       cuisine: 'nordic',        imageKeywords: 'salmon steak crispy potatoes dill' },
  { title: 'Bøf med rødvinssovs og hasselbackkartofler',      diet: 'glutenfri', dishType: 'aftensmad', protein: 'meat',       cuisine: 'french',        imageKeywords: 'beef steak red wine sauce potato' },
  { title: 'Ristede grøntsager med quinoa og tahindressing',  diet: 'glutenfri', dishType: 'aftensmad', protein: 'vegetarian', cuisine: 'mediterranean', imageKeywords: 'roasted vegetables quinoa bowl healthy' },
  { title: 'Rejer i hvidvinsovs med ris',                     diet: 'glutenfri', dishType: 'aftensmad', protein: 'fish',       cuisine: 'mediterranean', imageKeywords: 'shrimp white wine sauce rice seafood' },
  { title: 'Oksehalestuvet med rodfrugter og ris',             diet: 'glutenfri', dishType: 'aftensmad', protein: 'meat',       cuisine: 'danish',        imageKeywords: 'beef stew root vegetables slow cooked' },
  { title: 'Kyllingelår med citron og rosmarin',               diet: 'glutenfri', dishType: 'aftensmad', protein: 'chicken',    cuisine: 'mediterranean', imageKeywords: 'chicken thigh lemon rosemary roasted' },
  { title: 'Grøntsagscurry med kokosmælk og ris',             diet: 'glutenfri', dishType: 'aftensmad', protein: 'vegetarian', cuisine: 'asian',         imageKeywords: 'vegetable curry coconut milk rice vegan' },

  // ── Aftensmad / laktosefri ────────────────────────────────────────────────
  { title: 'Pasta bolognese med frisk pastadej',               diet: 'laktosefri', dishType: 'aftensmad', protein: 'meat',       cuisine: 'italian',   imageKeywords: 'pasta bolognese meat sauce italian' },
  { title: 'Spaghetti med rejer og chili',                     diet: 'laktosefri', dishType: 'aftensmad', protein: 'fish',       cuisine: 'italian',   imageKeywords: 'spaghetti shrimp chili garlic pasta' },
  { title: 'Kyllingebryst med pesto og ovnbagte tomater',      diet: 'laktosefri', dishType: 'aftensmad', protein: 'chicken',    cuisine: 'italian',   imageKeywords: 'chicken breast pesto tomatoes baked' },
  { title: 'Hakket oksekød i tacos med friske grøntsager',     diet: 'laktosefri', dishType: 'aftensmad', protein: 'meat',       cuisine: 'mexican',   imageKeywords: 'tacos ground beef fresh vegetables mexican' },
  { title: 'Teriyakikylling med nudler og sesamfrø',           diet: 'laktosefri', dishType: 'aftensmad', protein: 'chicken',    cuisine: 'asian',     imageKeywords: 'teriyaki chicken noodles sesame asian' },
  { title: 'Dampet torsk med kartofler og kapers',             diet: 'laktosefri', dishType: 'aftensmad', protein: 'fish',       cuisine: 'nordic',    imageKeywords: 'steamed cod fish potatoes capers nordic' },
  { title: 'Linsesuppe med gurkemeje og koriander',            diet: 'laktosefri', dishType: 'aftensmad', protein: 'vegetarian', cuisine: 'indian',    imageKeywords: 'lentil soup turmeric coriander bowl' },
  { title: 'Wok med oksekød og blandede grøntsager',           diet: 'laktosefri', dishType: 'aftensmad', protein: 'meat',       cuisine: 'asian',     imageKeywords: 'beef stir fry vegetables wok asian' },
  { title: 'Bagte søde kartofler med sort bønnesalsa',         diet: 'laktosefri', dishType: 'aftensmad', protein: 'vegetarian', cuisine: 'mexican',   imageKeywords: 'baked sweet potato black bean salsa' },
  { title: 'Grillet laks med ingefær og ærteris',              diet: 'laktosefri', dishType: 'aftensmad', protein: 'fish',       cuisine: 'asian',     imageKeywords: 'grilled salmon ginger pea rice' },

  // ── Aftensmad / begge (glutenfri + laktosefri) ───────────────────────────
  { title: 'Braiseret kylling med oliven og citron',           diet: 'begge', dishType: 'aftensmad', protein: 'chicken',    cuisine: 'mediterranean', imageKeywords: 'braised chicken olives lemon mediterranean' },
  { title: 'Pulled pork med coleslaw og søde kartofler',       diet: 'begge', dishType: 'aftensmad', protein: 'meat',       cuisine: 'american',      imageKeywords: 'pulled pork coleslaw sweet potato bbq' },
  { title: 'Kyllingesuppe med risnudler og ingefær',           diet: 'begge', dishType: 'aftensmad', protein: 'chicken',    cuisine: 'asian',         imageKeywords: 'chicken noodle soup ginger asian broth' },
  { title: 'Grillet tun med avocadosalsa og ris',              diet: 'begge', dishType: 'aftensmad', protein: 'fish',       cuisine: 'mediterranean', imageKeywords: 'grilled tuna avocado salsa rice' },
  { title: 'Lammekoteletter med rosmarin og bagte rodfrugter', diet: 'begge', dishType: 'aftensmad', protein: 'meat',       cuisine: 'mediterranean', imageKeywords: 'lamb chops rosemary roasted root vegetables' },
  { title: 'Røræg med røget laks og purløg',                   diet: 'begge', dishType: 'aftensmad', protein: 'fish',       cuisine: 'danish',        imageKeywords: 'scrambled eggs smoked salmon chives' },
  { title: 'Svampesteg med polenta og friske krydderurter',    diet: 'begge', dishType: 'aftensmad', protein: 'vegetarian', cuisine: 'italian',       imageKeywords: 'mushroom stew polenta herbs vegetarian' },
  { title: 'Dampet havtaske med grøntsager og ingefær',        diet: 'begge', dishType: 'aftensmad', protein: 'fish',       cuisine: 'asian',         imageKeywords: 'monkfish steamed ginger vegetables' },
  { title: 'Blomkål-bøf med krydret tomat og koriander',       diet: 'begge', dishType: 'aftensmad', protein: 'vegetarian', cuisine: 'mediterranean', imageKeywords: 'cauliflower steak spiced tomato herb' },
  { title: 'Oksecarpaccio med rucola og kapers',               diet: 'begge', dishType: 'aftensmad', protein: 'meat',       cuisine: 'italian',       imageKeywords: 'beef carpaccio arugula capers italian' },

  // ── Bagværk / glutenfri ───────────────────────────────────────────────────
  { title: 'Glutenfri bananbrød med valnødder',                diet: 'glutenfri', dishType: 'bagværk', protein: null, cuisine: 'american', imageKeywords: 'banana bread walnuts loaf sliced' },
  { title: 'Glutenfrie blåbærmuffins med mandelmel',           diet: 'glutenfri', dishType: 'bagværk', protein: null, cuisine: 'american', imageKeywords: 'blueberry muffins almond flour bakery' },
  { title: 'Havregrynsboller (glutenfri)',                      diet: 'glutenfri', dishType: 'bagværk', protein: null, cuisine: 'danish',   imageKeywords: 'oat rolls bread buns bakery' },
  { title: 'Mandelkager med hindbærsyltetøj',                  diet: 'glutenfri', dishType: 'bagværk', protein: null, cuisine: 'danish',   imageKeywords: 'almond cookies jam danish pastry' },
  { title: 'Glutenfri pizzabund med blomkål',                  diet: 'glutenfri', dishType: 'bagværk', protein: null, cuisine: 'italian',  imageKeywords: 'cauliflower pizza crust homemade' },

  // ── Bagværk / laktosefri ──────────────────────────────────────────────────
  { title: 'Laktosefrit surdejsbrød',                          diet: 'laktosefri', dishType: 'bagværk', protein: null, cuisine: 'danish',  imageKeywords: 'sourdough bread artisan loaf rustic' },
  { title: 'Olivenolie-focaccia med rosmarin',                 diet: 'laktosefri', dishType: 'bagværk', protein: null, cuisine: 'italian', imageKeywords: 'focaccia olive oil rosemary italian bread' },
  { title: 'Laktosefri æblekage med kanelstreusel',            diet: 'laktosefri', dishType: 'bagværk', protein: null, cuisine: 'danish',  imageKeywords: 'apple cake cinnamon streusel danish bakery' },
  { title: 'Laktosefri chokoladekage med hindbær',             diet: 'laktosefri', dishType: 'bagværk', protein: null, cuisine: 'french',  imageKeywords: 'chocolate cake raspberry dark rich' },
  { title: 'Krydrede boller med sesamfrø (laktosefri)',        diet: 'laktosefri', dishType: 'bagværk', protein: null, cuisine: 'danish',  imageKeywords: 'sesame seed rolls bread buns danish' },

  // ── Bagværk / begge ───────────────────────────────────────────────────────
  { title: 'Bananpandekager (glutenfri og laktosefri)',         diet: 'begge', dishType: 'bagværk', protein: null, cuisine: 'american', imageKeywords: 'banana pancakes stack breakfast maple syrup' },
  { title: 'Kokosmakroner',                                    diet: 'begge', dishType: 'bagværk', protein: null, cuisine: 'danish',   imageKeywords: 'coconut macaroons cookies danish bakery' },
  { title: 'Dadelboller med chiafrø',                          diet: 'begge', dishType: 'bagværk', protein: null, cuisine: 'danish',   imageKeywords: 'date rolls chia seeds healthy bread' },
  { title: 'Gulerodsboller med ingefær og appelsin',           diet: 'begge', dishType: 'bagværk', protein: null, cuisine: 'danish',   imageKeywords: 'carrot muffins ginger orange gluten free' },
  { title: 'Rismelboller med solsikkekerner',                  diet: 'begge', dishType: 'bagværk', protein: null, cuisine: 'danish',   imageKeywords: 'rice flour rolls sunflower seeds bread' },

  // ── Dessert / glutenfri ───────────────────────────────────────────────────
  { title: 'Chokoladefondant med vaniljeis (glutenfri)',        diet: 'glutenfri', dishType: 'dessert', protein: null, cuisine: 'french',   imageKeywords: 'chocolate lava cake vanilla ice cream dessert' },
  { title: 'Citronfromage (glutenfri)',                         diet: 'glutenfri', dishType: 'dessert', protein: null, cuisine: 'danish',   imageKeywords: 'lemon mousse dessert danish light creamy' },
  { title: 'Panna cotta med jordbærsauce (glutenfri)',         diet: 'glutenfri', dishType: 'dessert', protein: null, cuisine: 'italian',  imageKeywords: 'panna cotta strawberry sauce dessert' },
  { title: 'Glutenfri brownie med valnødder',                  diet: 'glutenfri', dishType: 'dessert', protein: null, cuisine: 'american', imageKeywords: 'brownie walnuts chocolate square fudgy' },
  { title: 'Ristede mandler med karamel og flagesalt',         diet: 'glutenfri', dishType: 'dessert', protein: null, cuisine: 'danish',   imageKeywords: 'caramelized almonds sea salt candy sweet' },

  // ── Dessert / laktosefri ──────────────────────────────────────────────────
  { title: 'Frugttærte med vaniljecreme (laktosefri)',         diet: 'laktosefri', dishType: 'dessert', protein: null, cuisine: 'french',   imageKeywords: 'fruit tart vanilla cream pastry colorful' },
  { title: 'Sorbetis med mango og lime',                       diet: 'laktosefri', dishType: 'dessert', protein: null, cuisine: 'tropical', imageKeywords: 'mango lime sorbet ice cream tropical' },
  { title: 'Laktosefri chokolademousse',                       diet: 'laktosefri', dishType: 'dessert', protein: null, cuisine: 'french',   imageKeywords: 'chocolate mousse dark creamy dessert' },
  { title: 'Æblekompot med kanel og vanilje',                  diet: 'laktosefri', dishType: 'dessert', protein: null, cuisine: 'danish',   imageKeywords: 'apple compote cinnamon vanilla warm dessert' },
  { title: 'Kokosdessert med passionsfrugt',                   diet: 'laktosefri', dishType: 'dessert', protein: null, cuisine: 'tropical', imageKeywords: 'coconut passion fruit dessert tropical bowl' },

  // ── Dessert / begge ───────────────────────────────────────────────────────
  { title: 'Rødgrød med fløde-alternativ',                     diet: 'begge', dishType: 'dessert', protein: null, cuisine: 'danish',   imageKeywords: 'red berry pudding danish dessert summer' },
  { title: 'Bagt pære med honning og mandler',                 diet: 'begge', dishType: 'dessert', protein: null, cuisine: 'french',   imageKeywords: 'baked pear honey almonds dessert autumn' },
  { title: 'Frisk frugtsalat med mynte og lime',               diet: 'begge', dishType: 'dessert', protein: null, cuisine: 'tropical', imageKeywords: 'fresh fruit salad mint lime colorful bowl' },
  { title: 'Risalamande (glutenfri og laktosefri)',            diet: 'begge', dishType: 'dessert', protein: null, cuisine: 'danish',   imageKeywords: 'rice pudding almond cherry danish christmas' },
  { title: 'Kokoscreme med hindbær og ristede kokosflager',    diet: 'begge', dishType: 'dessert', protein: null, cuisine: 'tropical', imageKeywords: 'coconut cream raspberry toasted flakes dessert' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────
function getDiets(diet) {
  if (diet === 'glutenfri')   return ['gluten free']
  if (diet === 'laktosefri')  return ['dairy free']
  return ['gluten free', 'dairy free']
}

function getDishTypes(dishType) {
  if (dishType === 'aftensmad') return ['dinner', 'main course']
  if (dishType === 'bagværk')   return ['bakery', 'bread']
  return ['dessert']
}

// Follows Unsplash Source redirect to get a stable photo URL
async function fetchUnsplashUrl(keywords) {
  const url = `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(keywords)}`
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'manual' })
    const location = res.headers.get('location')
    if (location) {
      const base = location.split('?')[0]
      return `${base}?w=600&q=80`
    }
  } catch (e) {
    console.warn(`  Unsplash fejl for "${keywords}": ${e.message}`)
  }
  return url
}

// ─── Claude batch generation ──────────────────────────────────────────────
async function generateBatch(specs) {
  const dietConstraints = {
    glutenfri:  'Brug IKKE gluten (mel, hvede, byg, rug, spelt). Brug glutenfrie alternativer: rismel, majsmel, mandelmel, glutenfrie havregryn, kartoffelstivelse.',
    laktosefri: 'Brug IKKE laktose (mælk, fløde, smør, ost, yoghurt). Brug laktosefrie alternativer: plantemælk, laktosefri fløde/smør, kokosolie, dairy-free ost.',
    begge:      'Brug HVERKEN gluten (mel, hvede, byg, rug, spelt) ELLER laktose (mælk, fløde, smør, ost, yoghurt). Alle ingredienser skal være både gluten- og laktosefrie.',
  }

  const recipeList = specs.map((s, i) =>
    `${i + 1}. "${s.title}" — ${s.dishType}, ${s.diet}${s.protein ? ', protein: ' + s.protein : ''}`
  ).join('\n')

  const constraints = specs.map(s =>
    `  Opskrift "${s.title}": ${dietConstraints[s.diet]}`
  ).join('\n')

  const prompt = `Du er en erfaren dansk kokkebog-forfatter. Generer ${specs.length} komplette, familievenlige opskrifter.

OPSKRIFTER:
${recipeList}

DIÆTRESTRIKTIONER (overhold disse 100%):
${constraints}

KRAV:
- Ingredienser: konkrete mængder på dansk (f.eks. "400 g kyllingebryst, skåret i stykker", "2 spsk olivenolie")
- Steps: 4-7 trin, præcise instruktioner på dansk, familievenlige
- readyInMinutes: realistisk tid inkl. forberedelse (ikke for lav)
- servings: 4 for aftensmad, 8-12 for bagværk/dessert
- cuisine: det faktiske køkken (danish/italian/french/asian/mediterranean/american/indian/mexican/tropical/nordic)
- nutrition: realistisk skøn pr. portion (calories, protein g, carbs g, fat g)

Svar KUN med en JSON-array — ingen forklaring, ingen markdown-blokke, kun ren JSON:
[
  {
    "title": "...",
    "readyInMinutes": 45,
    "servings": 4,
    "cuisine": "danish",
    "ingredients": ["400 g hakket svinekød", "1 æg", "..."],
    "steps": ["Trin 1 ...", "Trin 2 ..."],
    "nutrition": { "calories": 480, "protein": 30, "carbs": 35, "fat": 18 }
  }
]`

  process.stdout.write(`\nBatch [${specs.map(s => s.title).slice(0, 2).join(', ')}${specs.length > 2 ? '...' : ''}]`)

  const stream = client.messages.stream({
    model: 'claude-opus-4-6',
    max_tokens: 8000,
    messages: [{ role: 'user', content: prompt }],
  })

  let fullText = ''
  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      fullText += event.delta.text
      process.stdout.write('.')
    }
  }
  console.log(' done')

  const jsonMatch = fullText.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Ingen JSON-array i svar:\n' + fullText.slice(0, 300))
  return JSON.parse(jsonMatch[0])
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Fejl: Sæt ANTHROPIC_API_KEY miljøvariabel')
    console.error('  export ANTHROPIC_API_KEY=sk-ant-...')
    process.exit(1)
  }

  await fs.mkdir(RECIPES_DIR, { recursive: true })

  const allRecipes = []
  const BATCH_SIZE = 5

  console.log(`Genererer ${SPECS.length} opskrifter i batches af ${BATCH_SIZE}...\n`)

  for (let i = 0; i < SPECS.length; i += BATCH_SIZE) {
    const batch = SPECS.slice(i, i + BATCH_SIZE)
    const startId = 1000 + i

    let generated
    try {
      generated = await generateBatch(batch)
    } catch (e) {
      console.error(`\nFejl i batch ${Math.floor(i / BATCH_SIZE) + 1}: ${e.message}`)
      continue
    }

    for (let j = 0; j < batch.length; j++) {
      const spec = batch[j]
      const data = generated[j]

      if (!data) {
        console.warn(`  ADVARSEL: Mangler data for "${spec.title}"`)
        continue
      }

      const id = startId + j

      process.stdout.write(`  Billede til "${spec.title}"... `)
      const image = await fetchUnsplashUrl(spec.imageKeywords)
      console.log('ok')

      const fullRecipe = {
        id,
        title: spec.title,
        image,
        readyInMinutes: data.readyInMinutes || 30,
        servings:       data.servings || 4,
        dishTypes:      getDishTypes(spec.dishType),
        cuisines:       [data.cuisine || spec.cuisine],
        diets:          getDiets(spec.diet),
        protein:        spec.protein,
        ingredients:    data.ingredients || [],
        steps:          data.steps || [],
        nutrition:      data.nutrition || {},
      }

      const listMeta = {
        id,
        title:          fullRecipe.title,
        image,
        readyInMinutes: fullRecipe.readyInMinutes,
        servings:       fullRecipe.servings,
        dishTypes:      fullRecipe.dishTypes,
        cuisines:       fullRecipe.cuisines,
        diets:          fullRecipe.diets,
        protein:        fullRecipe.protein,
      }

      await fs.writeFile(
        path.join(RECIPES_DIR, `${id}.json`),
        JSON.stringify(fullRecipe, null, 2),
        'utf8'
      )
      console.log(`  ✓ ${id}.json — ${spec.title}`)

      allRecipes.push(listMeta)
    }

    // Brief pause between batches
    if (i + BATCH_SIZE < SPECS.length) {
      await new Promise(r => setTimeout(r, 1500))
    }
  }

  await fs.writeFile(
    path.join(PUBLIC, 'recipes.json'),
    JSON.stringify({ recipes: allRecipes }, null, 2),
    'utf8'
  )

  console.log(`\n✅ Færdig!`)
  console.log(`   ${allRecipes.length} opskrifter genereret`)
  console.log(`   public/recipes.json opdateret`)
  console.log(`   ${allRecipes.length} individuelle filer i public/recipes/`)

  // Summary
  const byDishType = {}
  const byDiet = {}
  allRecipes.forEach(r => {
    const dt = r.dishTypes[0]
    byDishType[dt] = (byDishType[dt] || 0) + 1
    r.diets.forEach(d => { byDiet[d] = (byDiet[d] || 0) + 1 })
  })
  console.log('\nFordeling:')
  Object.entries(byDishType).forEach(([k, v]) => console.log(`  ${k}: ${v}`))
  console.log('Diæter:')
  Object.entries(byDiet).forEach(([k, v]) => console.log(`  ${k}: ${v}`))
}

main().catch(err => {
  console.error('\nFatal fejl:', err)
  process.exit(1)
})
