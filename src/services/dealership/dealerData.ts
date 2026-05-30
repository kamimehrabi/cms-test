import appFetcher from "@/lib/fetcher";

const apiPrefix = process.env.NEXT_PUBLIC_API_PREFIX;
const apiEndpoint = process.env.NEXT_PUBLIC_DEALERDATA_ENDPOINT;
const timeWorkEndpoint = process.env.NEXT_PUBLIC_DEALERTIMEWORK_ENDPOINT;
const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

export const getDealerData = async () => {
    // const dealerData = await appFetcher(`${apiPrefix}${apiEndpoint}${domain}`, ["dealer-data"]);
    // const timeWork = await appFetcher(`${apiPrefix}${timeWorkEndpoint}${domain}`, ["time-work"]);
    const dealerData = {
        "id": 1,
        "bussiness_name": "HILLZ GROUP",
        "dba": "hillz-dc",
        "business_phone": "416-248-1241",
        "business_fax": "141098",
        "business_street": "2323 Keele St ",
        "business_postal": "l1w0b6",
        "business_website": "hillz-dc.azurewebsites.net",
        "owner_phone_number": "11111111111",
        "owner_email": "ehsangholamifard@gmail.com",
        "owner_firstname": "ehsanehsan123",
        "owner_lastname": "gholami",
        "mailing_street": "fdgfdg111222",
        "mailing_postal": "fdgdfg",
        "primary_firstname": "sss",
        "primary_lastname": "fffff",
        "primary_phone_number": "11111111111",
        "primary_email": "chadkoforms@gmail.com",
        "longitude": "-122.94065900800986",
        "latitude": "49.21495662136936",
        "status": 6,
        "frk_dealer_owner_user_id": 21,
        "logo_url": "/hillzgroup/06094668939083636-755525042510881-4645981983555909-Logo_2.png",
        "redirect_url": null,
        "reject_message_SMS": null,
        "reject_message_email": null,
        "accept_message_SMS": null,
        "accept_message_email": "aliarjmandi339@gmail.com",
        "signup_type": 0,
        "frk_seller_submitter_id": null,
        "GST_NO": "2fzd",
        "HST_NO": "2fzd",
        "PST_NO": "fdefcwsfc",
        "RST_NO": null,
        "dealer_NO": "232323",
        "dealer_owner_signiture": "/hillzgroup/23300231821208106-red-car.png",
        "dealershipWebsite": "www.hillzgroup.com",
        "dealershipPackage": null,
        "DS_admin_reg_NO": null,
        "discount_fee": -20,
        "quickbooks_permit": 1,
        "quickbooks_company": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkZWFsZXJzaGlwSWQiOjEsImlhdCI6MTc0NDYxOTAxMX0.BRn71kl5fDKvDy6XjienaCeB1FfSqz638-3XvQKbQEw",
        "quickbooks_expense_account": null,
        "quickbooks_creditcard_account": null,
        "quickbooks_item_expense_account": null,
        "quickbooks_item_income_account": null,
        "quickbooks_item_asset_account": null,
        "enable": null,
        "comment": null,
        "speech_video": "/test/image_picker2104113443125021300.jpg-4860951306548187",
        "speech_video_screenshot": "/test/image_picker2104113443125021300.jpg-4860951306548187_sc.png-4713243432567513",
        "why_choose_us": null,
        "service_desc": null,
        "part_desc": null,
        "phone_numbers": null,
        "physical_address": null,
        "open_days_time": null,
        "business_caption": "\u003Cspan id=\"jodit-selection_marker_1738761344688_9827605385797351\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003E",
        "facebook": "https://www.facebook.com",
        "linkedin": "https://www.linkedin.com",
        "instagram": "https://www.instagram.com/vipmotors.canada",
        "twitter": "https://twitter.com",
        "youtube": "https://www.youtube.com",
        "valueYourTrade_desc": "\u003Cspan id=\"jodit-selection_marker_1738761490830_04128878342236075\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003E",
        "carFinder_desc": "\u003Cp\u003E\u003Cspan id=\"jodit-selection_marker_1684408184799_017610648208743696\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003ECar finder form&nbsp;is a tool that allows customers to provide specific details about the type of vehicle they are looking for.\u003C/p\u003E",
        "financial_desc": "\u003Cp\u003EAryaan Motors Financing Department is our auto loan and car lease resource. At Aryaan Motors, we take immense pleasure in providing resources and assistance in financing your next car. One of the best ways to begin your application is to check out our online car loan calculator for an estimate on car loan rate and then proceed to our online finance application.\u003Cspan id=\"jodit-selection_marker_1738761480783_6593730008500538\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003E\u003C/p\u003E",
        "bookApointment_desc": "\u003Cspan id=\"jodit-selection_marker_1738761482989_15427269195001903\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003E",
        "contactUs_desc": "\u003Cp\u003ETo contact us, please fill out the form below and a member of our team will get back to you as soon as possible.\u003Cspan id=\"jodit-selection_marker_1736066788539_3430807285382502\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003E\u003C/p\u003E",
        "serviceApointment_desc": "\u003Cspan id=\"jodit-selection_marker_1738761486469_6989593750998961\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003E",
        "orderPart_desc": "\u003Cspan id=\"jodit-selection_marker_1738761487615_09973205293445808\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003E",
        "testDrive_desc": "\u003Cspan id=\"jodit-selection_marker_1738761489310_173324965060484\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003E",
        "search_result_page": null,
        "our_mission": "      \u003Cp\u003E\n        Welcome to our new website! Regardless of if you're looking for an\n        economical subcompact sedan, or a large truck for the workplace, come to\n        RTM Auto Group and Leasing! We carry a large inventory of used vehicles\n        that encompasses everything from cars, truck, SUVs, hatchbacks, coupes,\n        and...\n      \u003C/p\u003E\n    ",
        "about_us": "\u003Cp\u003EWelcome 123 to our website. We know that buying a car is a big decision and can be stressful. We strive to help make this process as ea\u003Cspan id=\"jodit-selection_marker_1765178295538_9223779594610837\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003Esy and stress free as possible. We have been in business for years, selling high quality cars at the most affordable prices. We strive to exceed all your expectations when buying a car. Please take a look at our current offerings but if you do not see exactly what you want let us know as we can almost always find the exact car you are looking for through our large network of industry connections.\u003C/p\u003E",
        "welcome_note": "\u003Cp\u003E\u003Cspan id=\"jodit-selection_marker_1765178287779_37473778352444265\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003EqaAryaan \u003Cspan id=\"jodit-selection_marker_1765178287780_9142847209180779\" data-jodit-selection_marker=\"end\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003EMotorsZZ1243123. is the premium automotive dealership in Ontario. Powered by our technical expertise and quality experience (of over 20 years) in the automotive industry; we are able to handpick the finest pre-owned vehicles and recondition them to the highest level to cater to our customers needs. We have firmly established our reputation all over Ontario and rest of Canada. At&nbsp;Aryaan Motors&nbsp;we specialize in high end luxury cars and we court a number of popular brands.\u003C/p\u003E",
        "welcome_image_url": "/hillzgroup/8412248820950465-welcome.webp",
        "contactUs_image_url": "/hillzgroup/6350277913528539-carFinder.webp",
        "aboutUs_image_url": "/hillzgroup/03761305215538635-Car_finder_11zon.webp",
        "privacy_policy_note": "\u003Cdiv\u003E\r\n      \u003Cp\u003EPRIVACY POLICY\u003C/p\u003E\r\n      \u003Cp\u003EBEFORE USING OUR SITES, PLEASE READ THIS PRIVACY POLICY CAREFULLY.\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        This Privacy Policy is applicable to (\"RTM\")\r\n        and sets out our policy on the gathering and use of information on this\r\n        site and our other sites (collectively \"Sites\"). The Company is\r\n        committed to providing safe web sites for visitors of all ages and has\r\n        implemented this Privacy Policy to demonstrate our firm commitment to\r\n        your privacy. The Company complies with Canadian Federal and Provincial\r\n        privacy laws and regulations including the Personal Information and\r\n        Electronic Documents Act.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003E\r\n        There may be links from our Sites to other websites; note that this\r\n        Privacy Policy applies only to our Sites and not to web sites of other\r\n        companies or organizations to which our Sites may be linked. You must\r\n        check on any linked sites for the privacy policy that applies to that\r\n        site and/or make any necessary inquiries in respect of that privacy\r\n        policy with the operator of the linked site. These links to third party\r\n        websites are provided as a convenience and are for informational\r\n        purposes only. The Company does not endorse, and is not responsible for,\r\n        these linked websites.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003E\r\n        Although you are not required to register to access our Sites, you may\r\n        be asked to provide us with personal information when you visit certain\r\n        sections of our Sites. Your use of our Sites signifies your\r\n        acknowledgement and consent to our Privacy Policy. If you do not agree\r\n        to this Privacy Policy, please do not continue to use our Sites. Your\r\n        continued use of the Sites signifies your acceptance of these terms and\r\n        any changes in effect at the time of use.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003ECOLLECTION OF PERSONAL INFORMATION\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        Personal Information is information about you that identifies you as an\r\n        individual, for example, your name, address, e-mail address, or\r\n        telephone number.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003E\r\n        We collect information that you voluntarily provide to us through\r\n        responses to surveys, search functions, questionnaires, feedback, Tell\r\n        Your Story forms and the like. On some of our Sites, we offer health\r\n        assessment tools that ask you to provide self-assessment information. We\r\n        may also ask you to provide additional information such as your e-mail\r\n        address if you want to obtain additional services, information,\r\n        participate in a contest or to resolve complaints or concerns.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003EHOW DOES COMPANY USE INFORMATION GATHERED ABOUT ONLINE VISITORS?\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        Before forwarding us any personal information, please be advised that\r\n        any information gathered on our Sites may be used in the aggregate for\r\n        research and development relating to our Sites and/or for future site\r\n        development and, if you ask us to, to send you promotional materials. In\r\n        particular, we may use information gathered about you for the following\r\n        purposes: to monitor interest in our range of products and to assist us\r\n        to tailor the content of our Sites to your needs by collecting\r\n        information about your preferences through tracking of patterns page\r\n        views on our Sites; to create a profile relating to you in order to show\r\n        you the content that might be of interest to you and to display the\r\n        content according to your preferences; and, in circumstances where you\r\n        have indicated that you wish to receive additional information, to send\r\n        you information about us and promotional material about our products\r\n        together with details of any offers we may have available from time to\r\n        time.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003EPROMOTIONAL AND INFORMATIONAL OFFERS\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        With the permission of an online visitor, information submitted at the\r\n        time of registration or submission may be used for marketing and\r\n        promotional purposes by the Company provided notice of this fact is made\r\n        available online. If a visitor objects to such use for any reason,\r\n        he/she may prevent that use, either by e-mail request or by modifying\r\n        the registration information provided. The Company uses reasonable\r\n        efforts to maintain visitors' information in a secure environment. If\r\n        you have submitted personal information and want to change it or\r\n        opt-out, please contact us as described below.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003EDISCLOSURE OF INFORMATION\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        The Company will not disclose personal information that you provide on\r\n        its Sites to any third parties other than to a Company agent except: i)\r\n        in accordance with the terms of this Privacy Policy, or ii) to comply\r\n        with legal requirements such as a law, regulation, warrant, subpoena or\r\n        court order, and/or iii) if you are reporting an adverse event/side\r\n        effect, in which case the Company may be required to disclose such\r\n        information to bodies such as, but not limited to, Canadian and/or\r\n        international regulatory authorities. Please note that any of these\r\n        disclosures may involve the storage or processing of personal\r\n        information outside of Canada and may therefore be subject to different\r\n        privacy laws than those applicable in Canada, including laws that\r\n        require the disclosure of personal information to governmental\r\n        authorities under circumstances that are different than those that apply\r\n        in Canada.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003ECOOKIES\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        The Company, in common with many web site operators, may use standard\r\n        technology called \"cookies\" on its Sites. Cookies are small data files\r\n        that are downloaded onto your computer when you visit a particular web\r\n        site. You can disable cookies by turning them off in your browser;\r\n        however, some areas of the Sites may not function properly if you do so.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003EADDITIONAL TERMS FOR CERTAIN WEBSITES\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        The following additional information applies to our Sites that require\r\n        registration. Generally, you are not required to provide personal\r\n        information as a condition of using our Sites, except as may be\r\n        necessary to provide you with a product or service that you have\r\n        requested. However, some of our Sites are restricted to certain\r\n        individuals such as health care professionals or our prescription drug\r\n        patients and we may require these individuals to register upon entry by\r\n        providing us with certain information.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003EPROTECTION OF INFORMATION:\u003C/p\u003E\r\n      \u003Cp\u003EOur Commitment to Security\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        We have put in place physical, electronic, and managerial procedures to\r\n        safeguard and help prevent unauthorized access, maintain data security,\r\n        and correctly use the information we collect online. The Company applies\r\n        security safeguards appropriate to the sensitivity of the information,\r\n        such as retaining information in secure facilities and making personal\r\n        information accessible only to authorized employees on a need-to-know\r\n        basis.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003EStorage of Information:\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        Personal information you share with us is stored on our database servers\r\n        at Company data centers (in whatever country they may be located), or\r\n        hosted by third parties who have entered into agreements with us that\r\n        require them to observe our Privacy Policy.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003EPOLICY CHANGE:\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        If we alter our Privacy Policy, any changes will be posted on this page\r\n        of our Site so that you are always informed of the information we\r\n        collect about you, how we use it and the circumstances under which we\r\n        may disclose it.\r\n      \u003C/p\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cbr /\u003E\r\n      \u003Cp\u003EACCEPTANCE OF OUR PRIVACY POLICY:\u003C/p\u003E\r\n      \u003Cp\u003E\r\n        By using this Site or any other The Company Site or interactive banner\r\n        ads, you signify your acceptance of our Privacy Policy, and you adhere\r\n        to the terms and conditions posted on the Site. By submitting your\r\n        information, you agree that it will be governed by our Privacy Policy.\r\n      \u003C/p\u003E\r\n    \u003C/div\u003E",
        "feature_special_note": null,
        "our_brands_note": "\u003Cspan id=\"jodit-selection_marker_1738761342928_3226609523118622\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003E",
        "valueYourTrade_image_url": "/hillzgroup/5854982090406513-trade-in.webp",
        "carFinder_image_url": "/hillzgroup/3618613318272357-980728209786544-9557881438792353-down_part.webp",
        "financial_image_url": "/hillzgroup/9326658946128052-financeDepartment.webp",
        "bookApointment_image_url": "/hillzgroup/32207119841140264-bookAppointment.webp",
        "serviceApointment_image_url": "/hillzgroup/1872443428145314-buildingCredit.webp",
        "orderPart_image_url": "/hillzgroup/7483537558096858-financeApplication.webp",
        "testDrive_image_url": "/hillzgroup/1843379153632425-financeCalculator.webp",
        "tab_logo_url": "/hillzgroup/755525042510881-4645981983555909-Logo_2.png",
        "ds_invoice_name": "CHG1",
        "text_us_now_desc": "\u003Cspan id=\"jodit-selection_marker_1738761493604_15770889042185066\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003E",
        "text_us_now_url": "/hillzgroup/25887764096337085-textUs.webp",
        "map_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2868.247343393313!2d-79.4690766!3d44.036945800000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882ad2279676c87d%3A0x5b4fcc4b2d014bf0!2s570%20Sandford%20St%2C%20Newmarket%2C%20ON%20L3X%201T4%2C%20Canada!5e0!3m2!1sen!2s!4v1769771309520!5m2!1sen!2s",
        "change_status_date": "2025-06-28T08:22:57.000Z",
        "default_comment": " CALL ME NOWnnnnnnn HAHAHAHAHAHhohoho test test stetsts&nbsp; gdsystyfgy fgfdgfd gfdgfd gfdgdfg /kmsfinecarsinc/632944be-37f1-4e8f-b13c-a1dc82c68a88.png /hillzgroup/6173538486699162-hillz_big_logo.png ",
        "is_free_trial": false,
        "is_canceled": false,
        "weekly_payment": null,
        "createdAt": "2021-06-02T10:55:28.000Z",
        "updatedAt": "2026-01-30T11:13:29.000Z",
        "frk_business_city_id": 100,
        "frk_mailing_city_id": 1969,
        "business_phone2": null,
        "logo_url2": "/hillzgroup/4645981983555909-Logo_2.png",
        "payment_status": null,
        "image_template_default": 0,
        "template_only_on_cover": 1,
        "frk_default_bos_format": 2,
        "has_chat": 0,
        "disclosure": "\u003Cp\u003Ehillz hillz hillz hillz hillz hillllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz hllz hillz hillz h\u003Cspan id=\"jodit-selection_marker_1755425937844_22711373253117806\" data-jodit-selection_marker=\"start\" style=\"line-height: 0; display: none;\"\u003E﻿\u003C/span\u003Ez hillz hillz\u003Cp\u003E\u003Cbr\u003E\u003C/p\u003E﻿\u003C/p\u003E",
        "guaranty": null,
        "has_syndication": 1,
        "syndication_id": "1",
        "has_thumbnail_url_access": 0,
        "frk_central_branch": null,
        "frk_complex_id": null,
        "default_order": null,
        "tik_tok": null,
        "google_plus": "google.com",
        "in_test": 1,
        "added_wanted_permit": true,
        "creditapp_permit": true,
        "creditapp_retailer": "9fe1a80d-8e67-44f6-b5a3-fe533fb99554",
        "whatsapp": "9999999999",
        "public_email": null,
        "feature_permissions": [
            "customer-report",
            "email-listener",
            "email-signature",
            "no-accident",
            "payment-calculator",
            "youtube-link"
        ],
        "business_city": {
            "id": 100,
            "city": "Barrie",
            "isFromHereApi": false,
            "cl_cities": "brr",
            "is_free": true,
            "timezone": "America/Toronto",
            "belong_to_dealership": null,
            "frk_province": 1,
            "Province": {
                "id": 1,
                "province": "Ontario",
                "isFromHereApi": false,
                "abbreviation": "ON",
                "belong_to_dealership": null,
                "frk_country": 1,
                "Country": {
                    "id": 1,
                    "country": "Canada"
                }
            }
        },
        "mailing_city": {
            "id": 1969,
            "city": " EDMONTON",
            "isFromHereApi": false,
            "cl_cities": null,
            "is_free": null,
            "timezone": null,
            "belong_to_dealership": 354,
            "createdAt": "2023-06-10T17:37:30.000Z",
            "updatedAt": "2023-06-10T17:37:30.000Z",
            "frk_province": 2,
            "Province": {
                "id": 2,
                "province": "Alberta",
                "isFromHereApi": false,
                "abbreviation": "AB",
                "belong_to_dealership": null,
                "frk_country": 1,
                "Country": {
                    "id": 1,
                    "country": "Canada"
                }
            }
        },
        "OurTeams": [],
        "DealershipTags": [
            {
                "id": 1,
                "siteDisplayable": true,
                "isDefault": false,
                "value": "/hillz/one-owner.png",
                "Tag": {
                    "id": 2,
                    "name": "One Owner"
                }
            },
            {
                "id": 2,
                "siteDisplayable": true,
                "isDefault": false,
                "value": "/hillz/no-reported.png",
                "Tag": {
                    "id": 1,
                    "name": "No Reported Accident"
                }
            }
        ],
        "prefixUrl": "https://image123.azureedge.net"
    }
    return {
        ...dealerData,
        timeWork: [
            {
                "id": 35,
                "day": 1,
                "startAt": "09:00 AM",
                "endAt": "07:00 PM",
                "holiday": 0,
                "frk_dealership_id": 1
            },
            {
                "id": 34,
                "day": 2,
                "startAt": "09:00 AM",
                "endAt": "07:00 PM",
                "holiday": 0,
                "frk_dealership_id": 1
            },
            {
                "id": 33,
                "day": 3,
                "startAt": "09:00 AM",
                "endAt": "07:00 PM",
                "holiday": 0,
                "frk_dealership_id": 1
            },
            {
                "id": 32,
                "day": 4,
                "startAt": "09:00 AM",
                "endAt": "07:00 PM",
                "holiday": 0,
                "frk_dealership_id": 1
            },
            {
                "id": 31,
                "day": 5,
                "startAt": "09:00 AM",
                "endAt": "07:00 PM",
                "holiday": 0,
                "frk_dealership_id": 1
            },
            {
                "id": 30,
                "day": 6,
                "startAt": "10:00 AM",
                "endAt": "6:00 PM",
                "holiday": 0,
                "frk_dealership_id": 1
            },
            {
                "id": 29,
                "day": 7,
                "startAt": "",
                "endAt": "Closed!",
                "holiday": 1,
                "frk_dealership_id": 1
            }
        ]
    };
}


