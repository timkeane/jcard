var jcard = ["vcard",
             [
              ["version", {}, "text", "4.0"],
              ["fn", {}, "text", "Simon Perreault"],
              ["n", {}, "text", ["Perreault", "Simon", "", "", ["ing. jr", "M.Sc."]]],
              ["bday", {}, "date-and-or-time", "--02-03"],
              ["anniversary", {}, "date-and-or-time", "2009-08-08T14:30:00-05:00"],
              ["gender", {}, "text", "M"],
              ["lang", { "pref": "1" }, "language-tag", "fr"],
              ["lang", { "pref": "2" }, "language-tag", "en"],
              ["org", { "type": "work" }, "text", "Viagenie"],
              ["adr",
                 { "type": "work" },
                 "text",
                 [
                  "",
                  "Suite D2-630",
                  "2875 Laurier",
                  "Quebec",
                  "QC",
                  "G1V 2M2",
                  "Canada"
                 ]
              ],
              ["tel",
                { "type": ["work", "voice"], "pref": "1" },
                "uri",
                "tel:+1-418-656-9254;ext=102"
              ],
              ["tel",
                { "type": ["work", "cell", "voice", "video", "text"] },
                "uri",
                "tel:+1-418-262-6501"
              ],
              ["email",
                { "type": "work" },
                "text",
                "simon.perreault@viagenie.ca"
              ],
              ["geo", { "type": "work" }, "uri", "geo:46.772673,-71.282945"],
              ["key",
                { "type": "work" },
                "uri",
                "http://www.viagenie.ca/simon.perreault/simon.asc"
              ],
              ["tz", {}, "utc-offset", "-05:00"],
              ["url", { "type": "home" }, "uri", "http://nomis80.org"]
            ]
           ];