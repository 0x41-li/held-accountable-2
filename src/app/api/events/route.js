import { NextResponse } from 'next/server'
import { getCryptoSymbolPrices, getStockSymbolPrices } from '../../../../lib/trending'
import fs from 'fs';
import { getEventsFromNewsAi } from '@/services/polls/polls';

const getEventsData = async () => {
    const events = await getEventsFromNewsAi();
    return events;
}
export async function GET(req) {
    let data = [
        {
            "uri": "eng-11167555",
            "concepts": [
                {
                    "uri": "http://en.wikipedia.org/wiki/Absentee_ballot",
                    "type": "wiki",
                    "score": 100,
                    "label": {
                        "eng": "Absentee ballot"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Two-round_system",
                    "type": "wiki",
                    "score": 95,
                    "label": {
                        "eng": "Two-round system"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Early_voting",
                    "type": "wiki",
                    "score": 95,
                    "label": {
                        "eng": "Early voting"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Election_Day_(United_States)",
                    "type": "wiki",
                    "score": 70,
                    "label": {
                        "eng": "Election Day (United States)"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/County_(United_States)",
                    "type": "wiki",
                    "score": 32,
                    "label": {
                        "eng": "County (United States)"
                    }
                }
            ],
            "eventDate": "2025-12-02",
            "totalArticleCount": 5,
            "title": {
                "eng": "Runoff election in Fulton County | Where and when to vote early"
            },
            "summary": {
                "eng": "ATLANTA - Fulton County voters will have five days to cast ballots ahead of the Dec. 2 municipal runoff, with early voting set to open Saturday, Nov. 22, and continue through Wednesday, Nov. 26.\n\nWhat we know:\n\nThe runoff covers several mayoral, city council and school board races in Atlanta, Sandy Springs, Roswell, East Point and South Fulton. County officials released the full list of 14 advance voting sites, which includes multiple locations with absentee ballot drop boxes.\n\nEarly voting will "
            },
            "location": {
                "type": "place",
                "label": {
                    "eng": "Albuquerque, New Mexico"
                },
                "country": {
                    "type": "country",
                    "label": {
                        "eng": "United States"
                    }
                }
            },
            "categories": [
                {
                    "uri": "dmoz/Society/Politics/Campaigns_and_Elections",
                    "label": "dmoz/Society/Politics/Campaigns and Elections",
                    "wgt": 86
                },
                {
                    "uri": "dmoz/Society/Government/Parliaments_and_Legislatures",
                    "label": "dmoz/Society/Government/Parliaments and Legislatures",
                    "wgt": 100
                },
                {
                    "uri": "dmoz/Society/Issues/Online_Issues_Polls",
                    "label": "dmoz/Society/Issues/Online Issues Polls",
                    "wgt": 83
                },
                {
                    "uri": "news/Politics",
                    "label": "news/Politics",
                    "wgt": 89
                }
            ],
            "articleCounts": {
                "eng": 5
            },
            "sentiment": -0.01960784313725494,
            "wgt": 502329600,
            "relevance": 23
        },
        {
            "uri": "eng-11109702",
            "concepts": [
                {
                    "uri": "http://en.wikipedia.org/wiki/Deportation",
                    "type": "wiki",
                    "score": 100,
                    "label": {
                        "eng": "Deportation"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Tennessee",
                    "type": "loc",
                    "score": 100,
                    "label": {
                        "eng": "Tennessee"
                    },
                    "location": {
                        "type": "place",
                        "label": {
                            "eng": "Tennessee"
                        },
                        "country": {
                            "type": "country",
                            "label": {
                                "eng": "United States"
                            }
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/People_smuggling",
                    "type": "wiki",
                    "score": 93,
                    "label": {
                        "eng": "People smuggling"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Immigration",
                    "type": "wiki",
                    "score": 89,
                    "label": {
                        "eng": "Immigration"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Donald_Trump",
                    "type": "person",
                    "score": 89,
                    "label": {
                        "eng": "Donald Trump"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/El_Salvador",
                    "type": "loc",
                    "score": 76,
                    "label": {
                        "eng": "El Salvador"
                    },
                    "location": {
                        "type": "country",
                        "label": {
                            "eng": "El Salvador"
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Smuggling",
                    "type": "wiki",
                    "score": 72,
                    "label": {
                        "eng": "Smuggling"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/United_States",
                    "type": "loc",
                    "score": 68,
                    "label": {
                        "eng": "United States"
                    },
                    "location": {
                        "type": "country",
                        "label": {
                            "eng": "United States"
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Traffic_stop",
                    "type": "wiki",
                    "score": 63,
                    "label": {
                        "eng": "Traffic stop"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Nashville,_Tennessee",
                    "type": "loc",
                    "score": 58,
                    "label": {
                        "eng": "Nashville, Tennessee"
                    },
                    "location": {
                        "type": "place",
                        "label": {
                            "eng": "Nashville, Tennessee"
                        },
                        "country": {
                            "type": "country",
                            "label": {
                                "eng": "United States"
                            }
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/United_States_district_court",
                    "type": "wiki",
                    "score": 58,
                    "label": {
                        "eng": "United States district court"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/U.S._Immigration_and_Customs_Enforcement",
                    "type": "wiki",
                    "score": 56,
                    "label": {
                        "eng": "U.S. Immigration and Customs Enforcement"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Citizenship_of_the_United_States",
                    "type": "wiki",
                    "score": 50,
                    "label": {
                        "eng": "Citizenship of the United States"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Permanent_residency",
                    "type": "wiki",
                    "score": 50,
                    "label": {
                        "eng": "Permanent residency"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Court_order",
                    "type": "wiki",
                    "score": 47,
                    "label": {
                        "eng": "Court order"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Criminal_record",
                    "type": "wiki",
                    "score": 46,
                    "label": {
                        "eng": "Criminal record"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/United_States_Department_of_Justice",
                    "type": "wiki",
                    "score": 46,
                    "label": {
                        "eng": "United States Department of Justice"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Acquittal",
                    "type": "wiki",
                    "score": 42,
                    "label": {
                        "eng": "Acquittal"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Trumpism",
                    "type": "wiki",
                    "score": 41,
                    "label": {
                        "eng": "Trumpism"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/United_States_Deputy_Attorney_General",
                    "type": "wiki",
                    "score": 39,
                    "label": {
                        "eng": "United States Deputy Attorney General"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/United_States_Attorney",
                    "type": "wiki",
                    "score": 39,
                    "label": {
                        "eng": "United States Attorney"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Arrest_warrant",
                    "type": "wiki",
                    "score": 38,
                    "label": {
                        "eng": "Arrest warrant"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Maryland",
                    "type": "loc",
                    "score": 38,
                    "label": {
                        "eng": "Maryland"
                    },
                    "location": {
                        "type": "place",
                        "label": {
                            "eng": "Maryland"
                        },
                        "country": {
                            "type": "country",
                            "label": {
                                "eng": "United States"
                            }
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Speed_limit",
                    "type": "wiki",
                    "score": 36,
                    "label": {
                        "eng": "Speed limit"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/United_States_Department_of_Homeland_Security",
                    "type": "wiki",
                    "score": 34,
                    "label": {
                        "eng": "United States Department of Homeland Security"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Conspiracy_theory",
                    "type": "wiki",
                    "score": 34,
                    "label": {
                        "eng": "Conspiracy theory"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Fox_News",
                    "type": "org",
                    "score": 33,
                    "label": {
                        "eng": "Fox News"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Supreme_Court_of_the_United_States",
                    "type": "loc",
                    "score": 33,
                    "label": {
                        "eng": "Supreme Court of the United States"
                    },
                    "location": null
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Joshua_Abrego",
                    "type": "person",
                    "score": 21,
                    "label": {
                        "eng": "Joshua Abrego"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Liberia",
                    "type": "loc",
                    "score": 18,
                    "label": {
                        "eng": "Liberia"
                    },
                    "location": {
                        "type": "country",
                        "label": {
                            "eng": "Liberia"
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Eswatini",
                    "type": "loc",
                    "score": 16,
                    "label": {
                        "eng": "Eswatini"
                    },
                    "location": null
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Uganda",
                    "type": "loc",
                    "score": 16,
                    "label": {
                        "eng": "Uganda"
                    },
                    "location": {
                        "type": "country",
                        "label": {
                            "eng": "Uganda"
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Ghana",
                    "type": "loc",
                    "score": 16,
                    "label": {
                        "eng": "Ghana"
                    },
                    "location": {
                        "type": "country",
                        "label": {
                            "eng": "Ghana"
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Associated_Press",
                    "type": "org",
                    "score": 14,
                    "label": {
                        "eng": "Associated Press"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Waverly,_Tennessee",
                    "type": "loc",
                    "score": 10,
                    "label": {
                        "eng": "Waverly, Tennessee"
                    },
                    "location": {
                        "type": "place",
                        "label": {
                            "eng": "Waverly, Tennessee"
                        },
                        "country": {
                            "type": "country",
                            "label": {
                                "eng": "United States"
                            }
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Baltimore",
                    "type": "loc",
                    "score": 9,
                    "label": {
                        "eng": "Baltimore"
                    },
                    "location": {
                        "type": "place",
                        "label": {
                            "eng": "Baltimore"
                        },
                        "country": {
                            "type": "country",
                            "label": {
                                "eng": "United States"
                            }
                        }
                    }
                }
            ],
            "eventDate": "2025-12-08",
            "eventDateEnd": "2025-12-09",
            "totalArticleCount": 18,
            "title": {
                "eng": "After mistaken deportation, Abrego Garcia fights smuggling charges...."
            },
            "summary": {
                "eng": "NASHVILLE, Tenn. (AP) - Kilmar Abrego Garcia, whose mistaken deportation helped galvanize opposition to President Donald Trump's immigration policies, has hearings on Tuesday and Wednesday in the human smuggling case against him in Tennessee.\n\nU.S. District Judge Waverly Crenshaw will hear evidence on motions from the defense asking him to dismiss the charges and throw out some of the evidence.\n\nHere's what to know about the latest developments in the case:\n\nAbrego Garcia is a Salvadoran citizen "
            },
            "location": {
                "type": "place",
                "label": {
                    "eng": "Tennessee"
                },
                "country": {
                    "type": "country",
                    "label": {
                        "eng": "United States"
                    }
                }
            },
            "categories": [
                {
                    "uri": "dmoz/Society/Law/Legal_Information",
                    "label": "dmoz/Society/Law/Legal Information",
                    "wgt": 92
                },
                {
                    "uri": "dmoz/Society/Issues/Crime_and_Justice",
                    "label": "dmoz/Society/Issues/Crime and Justice",
                    "wgt": 71
                },
                {
                    "uri": "dmoz/Society/Transgendered/Law",
                    "label": "dmoz/Society/Transgendered/Law",
                    "wgt": 61
                },
                {
                    "uri": "news/Politics",
                    "label": "news/Politics",
                    "wgt": 92
                }
            ],
            "articleCounts": {
                "eng": 18
            },
            "sentiment": -0.192156862745098,
            "wgt": 502848000,
            "relevance": 24
        },
        {
            "uri": "eng-11132397",
            "concepts": [
                {
                    "uri": "http://en.wikipedia.org/wiki/Tennessee",
                    "type": "loc",
                    "score": 100,
                    "label": {
                        "eng": "Tennessee"
                    },
                    "location": {
                        "type": "place",
                        "label": {
                            "eng": "Tennessee"
                        },
                        "country": {
                            "type": "country",
                            "label": {
                                "eng": "United States"
                            }
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Death_row",
                    "type": "wiki",
                    "score": 82,
                    "label": {
                        "eng": "Death row"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Lethal_injection",
                    "type": "wiki",
                    "score": 71,
                    "label": {
                        "eng": "Lethal injection"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Rape",
                    "type": "wiki",
                    "score": 71,
                    "label": {
                        "eng": "Rape"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Electric_chair",
                    "type": "wiki",
                    "score": 70,
                    "label": {
                        "eng": "Electric chair"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Capital_punishment",
                    "type": "wiki",
                    "score": 64,
                    "label": {
                        "eng": "Capital punishment"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Chattanooga,_Tennessee",
                    "type": "loc",
                    "score": 48,
                    "label": {
                        "eng": "Chattanooga, Tennessee"
                    },
                    "location": {
                        "type": "place",
                        "label": {
                            "eng": "Chattanooga, Tennessee"
                        },
                        "country": {
                            "type": "country",
                            "label": {
                                "eng": "United States"
                            }
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/U.S._state",
                    "type": "loc",
                    "score": 39,
                    "label": {
                        "eng": "U.S. state"
                    },
                    "location": null
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Nashville,_Tennessee",
                    "type": "loc",
                    "score": 37,
                    "label": {
                        "eng": "Nashville, Tennessee"
                    },
                    "location": {
                        "type": "place",
                        "label": {
                            "eng": "Nashville, Tennessee"
                        },
                        "country": {
                            "type": "country",
                            "label": {
                                "eng": "United States"
                            }
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Tennessee_Department_of_Correction",
                    "type": "wiki",
                    "score": 36,
                    "label": {
                        "eng": "Tennessee Department of Correction"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Murder",
                    "type": "wiki",
                    "score": 36,
                    "label": {
                        "eng": "Murder"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Bill_Lee_(Tennessee_politician)",
                    "type": "person",
                    "score": 35,
                    "label": {
                        "eng": "Bill Lee (Tennessee politician)"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Pardon",
                    "type": "wiki",
                    "score": 34,
                    "label": {
                        "eng": "Pardon"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Governor",
                    "type": "wiki",
                    "score": 34,
                    "label": {
                        "eng": "Governor"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Life_imprisonment",
                    "type": "wiki",
                    "score": 29,
                    "label": {
                        "eng": "Life imprisonment"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Coronavirus",
                    "type": "wiki",
                    "score": 25,
                    "label": {
                        "eng": "Coronavirus"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Wayne_County,_Michigan",
                    "type": "loc",
                    "score": 19,
                    "label": {
                        "eng": "Wayne County, Michigan"
                    },
                    "location": {
                        "type": "place",
                        "label": {
                            "eng": "Wayne County, Michigan"
                        },
                        "country": {
                            "type": "country",
                            "label": {
                                "eng": "United States"
                            }
                        }
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Treaty",
                    "type": "wiki",
                    "score": 17,
                    "label": {
                        "eng": "Treaty"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Wayne_Nichols",
                    "type": "person",
                    "score": 16,
                    "label": {
                        "eng": "Wayne Nichols"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Pentobarbital",
                    "type": "wiki",
                    "score": 16,
                    "label": {
                        "eng": "Pentobarbital"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Prison_officer",
                    "type": "wiki",
                    "score": 15,
                    "label": {
                        "eng": "Prison officer"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Riverbend_Maximum_Security_Institution",
                    "type": "wiki",
                    "score": 14,
                    "label": {
                        "eng": "Riverbend Maximum Security Institution"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Christianity",
                    "type": "wiki",
                    "score": 13,
                    "label": {
                        "eng": "Christianity"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Prison",
                    "type": "wiki",
                    "score": 12,
                    "label": {
                        "eng": "Prison"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Lawyer",
                    "type": "wiki",
                    "score": 12,
                    "label": {
                        "eng": "Lawyer"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Republican_Party_(United_States)",
                    "type": "org",
                    "score": 12,
                    "label": {
                        "eng": "Republican Party (United States)"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Bible",
                    "type": "wiki",
                    "score": 11,
                    "label": {
                        "eng": "Bible"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Associated_Press",
                    "type": "org",
                    "score": 11,
                    "label": {
                        "eng": "Associated Press"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Phil_Bredesen",
                    "type": "person",
                    "score": 9,
                    "label": {
                        "eng": "Phil Bredesen"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Commutation_(law)",
                    "type": "wiki",
                    "score": 8,
                    "label": {
                        "eng": "Commutation (law)"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Independent_politician",
                    "type": "org",
                    "score": 7,
                    "label": {
                        "eng": "Independent politician"
                    }
                },
                {
                    "uri": "http://en.wikipedia.org/wiki/Democratic_Party_(United_States)",
                    "type": "org",
                    "score": 7,
                    "label": {
                        "eng": "Democratic Party (United States)"
                    }
                }
            ],
            "eventDate": "2025-12-11",
            "totalArticleCount": 32,
            "title": {
                "eng": "Tennessee death row inmate declines to choose between the electric chair and lethal injection"
            },
            "summary": {
                "eng": "Tennessee death row inmate Harold Wayne Nichols on Monday declined to choose between the electric chair and lethal injection for his Dec. 11 execution, meaning the state will default to lethal injection.Nichols was sentenced to death in 1990 after he was convicted of raping and murdering Karen Pulley, a 21-year-old student at Chattanooga State University, two years earlier. He has two weeks to change his mind about choosing which method will be used, Tennessee Department of Correction spokesperso"
            },
            "location": {
                "type": "place",
                "label": {
                    "eng": "Tennessee"
                },
                "country": {
                    "type": "country",
                    "label": {
                        "eng": "United States"
                    }
                }
            },
            "categories": [
                {
                    "uri": "dmoz/Society/Crime",
                    "label": "dmoz/Society/Crime",
                    "wgt": 86
                },
                {
                    "uri": "dmoz/Society/Issues/Crime_and_Justice",
                    "label": "dmoz/Society/Issues/Crime and Justice",
                    "wgt": 68
                },
                {
                    "uri": "dmoz/Society/Crime/Murder",
                    "label": "dmoz/Society/Crime/Murder",
                    "wgt": 69
                },
                {
                    "uri": "news/Politics",
                    "label": "news/Politics",
                    "wgt": 78
                }
            ],
            "articleCounts": {
                "eng": 32
            },
            "sentiment": -0.3254901960784313,
            "wgt": 503107200,
            "relevance": 22
        }
    ];
    return NextResponse.json({ message: 'Received', data: data }, { status: 200 });
    // if (fs.existsSync("upcoming_events")) {
    //     const dump = JSON.parse(fs.readFileSync("upcoming_events"));
    //     if (Date.now() - dump.last_timestamp > 3600 * 1000) {
    //         data = await getEventsData();
    //         fs.writeFileSync("upcoming_events", JSON.stringify({ last_timestamp: Date.now(), data }));
    //     } else {
    //         data = dump.data;
    //     }
    //     return NextResponse.json({ message: 'Received', data: data.events.results }, { status: 200 });
    // }
    // data = await getEventsData();
    // fs.writeFileSync("upcoming_events", JSON.stringify({ last_timestamp: Date.now(), data }));
    // return NextResponse.json({ message: 'Received', data: data.events.results }, { status: 200 });
}